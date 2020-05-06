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
var session = require('express-session');
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
                    req.session.loggedIn = true;
                    req.session.userID = data.userID;
                    res.redirect(data.redirectURL);
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

    //////////////////////// Add New Device ////////////////////////
    /**
     * JSON Request Example:
     * {
     *      "deviceName": "A Friendly Name"
     * }
     */
    app.post('/add-device', function(req, res) {
        const data = req.body;

        if ( data.deviceName.length > 0 && data.deviceName.length <= 20 && req.session.loggedIn === true ) {
            addDevice(data, req, res);
        } else if (req.session.loggedIn !== true) {
            res.send(JSON.stringify({
                "success": false,
                "errors": [
                    {
                        "errorMessage": "You are not logged in!",
                        "field": null
                    }
                ]
            }));
        } else if (data.deviceName.length > 20) {
            res.send(JSON.stringify({
                "success": false,
                "errors": [
                    {
                        "errorMessage": "Device name must be less than 20 characters.",
                        "field": "name"
                    }
                ]
            }));
        } else {
            res.send(JSON.stringify({
                "success": false,
                "errors": [
                    {
                        "errorMessage": "Device must be given a name.",
                        "field": "name"
                    }
                ]
            }));
        }
    });

    function addDevice(data, req, res) {
        const randomID = generateRandomID(64);

        let sql = "INSERT INTO device (device_id, user_id, device_name) VALUES (?,?,?)";
        con.query(sql, [randomID, req.session.userID, data.deviceName], function (err, result) {
            if (!err)
            {
                console.log("Number of devices inserted: " + result.affectedRows);
                if (result.affectedRows === 1) {
                    res.send(JSON.stringify({"success": true, "deviceID": randomID, "errors": []}));
                } else {
                    res.send("Device could not be created.");
                }
            } else {
                console.log(err);
                res.send("Device could not be created.");
            }
        });
    }

    //////////////////////// Get User Meta ////////////////////////
    /**
     * JSON Response Example:
     * {
     *      "loggedIn": true,
     *      "userID": 1,
     *      "devices": [
     *          {
     *              "device_id": "m7iU5udHvFiDvkWj7sno7yZxCZhGFQeJRpjfWtpVUAbm7dwoy8ugmOePqLiZ2Knh",
     *              "user_id": 1,
     *              "device_name": "A New Device",
     *              "timestamp": "2020-05-05T20:01:26.000Z"
     *          }
     *      ]
     * }
     */
    app.post('/get-user-meta', function(req, res) {

        if (req.session.loggedIn === true) {
            let callback = devices => {
                res.send(JSON.stringify({
                    "loggedIn": req.session.loggedIn,
                    "userID": req.session.userID,
                    "devices": devices
                }));
            }

            getDevices(req.session.userID, callback);
        } else {
            res.send(JSON.stringify({
                "loggedIn": false
            }));
        }

    });

    /**
     * Gets the devices for a specified user
     * @param {number} userID The user ID
     * @param {function} callback The function to callback with the array of devices
     */
    function getDevices(userID, callback) {
        let sql = "SELECT * FROM device WHERE user_id = ?";
        con.query(sql, [userID], function (err, result) {
            if (!err)
            {
                console.log("Number of devices returned: " + result.length);
                console.log(result);
                if (result.length > 0) {
                    callback(result);
                } else {
                    callback([]);
                }
            } else {
                callback([]);
            }
        });
    }

    /**
     * Given a number will generate a random string containing characters:
     * "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
     * For example, generateRandomID(4) may return "gY4T".
     * 62^length unique combinations.
     * @param {*} length How long the random ID should be
     */
    function generateRandomID(length) {
        let id = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(let i = 0; i < length; i++) {
            let randomNumber = Math.floor(Math.random() * characters.length); //Get a random index
            id += characters.charAt(randomNumber);
        }
        return id;
    }

} catch(err) {
    console.log(err);
}