//////////////////////////////////// Dependencies ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
"use strict";

const express = require('express');

// Setup DB connection
var mysql = require('mysql');
var con = require('./connect');
var cred = require('./credentials');
const https = require('https');
const app = express();
const port = 4020;

// Heath Check
app.listen(port, () => console.log(`Track API is listening on port ${port}!`));

app.get('/', function(req, res){
    res.send(`Track API is listening on port ${port}!`);
});

try {

    // https://auth.mattdavis.info/api/auth?redirectURL=https%3A%2F%2Ftrack.mattdavis.info%2F&tokenURL=https%3A%2F%2Ftrack.mattdavis.info%2Fapi%2Fuse-token

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

        // https://auth.mattdavis.info/api/check-token?token=
    });

} catch(err) {
    console.log(err);
}