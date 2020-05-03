//////////////////////////////////// Dependencies ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
"use strict";

// Express
const express = require('express');
const app = express();
const port = 4020;

// Setup DB connection
var mysql = require('mysql');
var con = require('./connect');
var cred = require('./credentials');

const https = require('https');

// Client Session
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore({}, con);
// Set Session Parameters
app.use(session({
    key: "track.mattdavis.info cookie",
    secret: cred.sessionSecret,
    saveUninitialized: false,
    store: sessionStore,
    resave: false,
    cookie: {
        maxAge: 3600000, // 1 Hour
        secure: cred.secureCookie,
        httpOnly: true
    }
}));

// Parse body of request as a JSON object.
app.use(express.json());

// Heath Check
app.listen(port, () => console.log(`Track API is listening on port ${port}!`));

app.get('/', function(req, res){
    res.send(`Track API is listening on port ${port}!`);
});

try {

    // https://auth.mattdavis.info/api/auth?redirectURL=https%3A%2F%2Ftrack.mattdavis.info%2F&tokenURL=https%3A%2F%2Ftrack.mattdavis.info%2Fapi%2Fuse-token
    // https://auth.mattdavis.info/api/check-token?token=


    //////////////////////// Use Token ////////////////////////
    app.get('/use-token', function (req, res){
        let token = req.query.token;
        let path = "/api/check-token?token=" + token;

        let jsonData = "";

        const authReq = https.request({
            hostname: 'auth.mattdavis.info',
            port: 443,
            path: path,
            method: 'GET'
        }, authRes => {
            console.log(`statusCode: ${res.statusCode}`);
          
            authRes.on('data', d => {
                process.stdout.write(d);
                jsonData += d;
            });

            authRes.on('end', () => {
                const data = JSON.parse(jsonData);
                console.log("LoggedIn: " + data.loggedIn);
                if(data.loggedIn === true) {
                    res.send("User was authenticated with this token!: " + jsonData);
                    req.session.loggedIn = true;
                    req.session.userID = data.userID;
                } else {
                    res.send("User could not be authenticated using SSO.");
                }
            });
        });
        
        authReq.on('error', error => {
            console.error(error);
            res.send("An error occured. Please try again later.");
        });
        
        authReq.end();

    });

    //////////////////////// Submit Node ////////////////////////
    /**
     * JSON Request Example:
     * {
     *      "deviceID": "abcde",
     *      "longitude": 5.4965325,
     *      "latitude": 3.1655425
     * }
     */
    app.post('/submit-node', function(req, res) {
        const data = req.body;

        let idIsCorrect = false;
        let sql = "SELECT * FROM device WHERE device_id = ?";
        con.query(sql, [data.deviceID], function (err, result) {
            if (!err)
            {
                console.log("Number of devices returned: " + result.length);
                if (result.length === 1) {
                    insertNode(data, req, res);
                } else {
                    res.send("Device ID is incorrect.");
                }
            } else {
                res.send("Device ID is incorrect.");
            }
        });
    });

    function insertNode(data, req, res) {
        let sql = "INSERT INTO node (device_id, longitude, latitude) VALUES (?,?,?)";
        con.query(sql, [data.deviceID, data.longitude, data.latitude], function (err, result) {
            if (!err)
            {
                console.log("Number of nodes inserted: " + result.affectedRows);
                if (result.affectedRows === 1) {
                    res.send(JSON.stringify({"success": true, "nodeID": result.insertId, "errors": []}));
                } else {
                    res.send("Node could not be inserted.");
                }
            } else {
                res.send("Node could not be inserted.");
            }
        });
    }

} catch(err) {
    console.log(err);
}