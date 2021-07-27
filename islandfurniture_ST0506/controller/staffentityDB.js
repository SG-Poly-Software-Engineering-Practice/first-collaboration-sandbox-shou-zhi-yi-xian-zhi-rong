var express = require('express');
var app = express();
let middleware = require('./middleware');

var staff = require('../model/staffModel.js');
app.get('/api/staffLockState', middleware.checkToken, function (req, res) {
    var email = req.query.email;
    staff.getStaffLockState(email)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get staff lock state");
        });
});

app.get('/api/getStaff', middleware.checkToken, function (req, res) {
    var email = req.query.email;
    staff.getStaff(email)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get staff");
        });
});

app.get('/api/getStaffRoles/:id', middleware.checkToken, function (req, res) {
    var id = req.params.id;
    staff.getStaffRoles(id)
        .then((role) => {
            staff.getStaffAccessRight(id)
                .then((result) => {
                    res.send({ role: role, accessRight: result});
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send("Failed to get staff access right");
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get staff roles");
        });
});

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false });
app.post('/api/loginStaff', jsonParser, function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    staff.checkStaffLogin(email, password)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to check staff login");
        });
});

app.put('/api/updateStaff', [middleware.checkToken, jsonParser], function (req, res) {
    staff.updateStaff(req.body)
        .then((result) => {
            if(result.success) {
                staff.getStaff(req.body.email)
                    .then((result) => {
                        res.send(result);
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).send("Failed to get staff");
                    });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to update staff");
        });
});

module.exports = app;