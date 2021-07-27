var express = require('express');
var app = express();
let middleware = require('./middleware');

var rm = require('../model/rawmaterialModel.js');

app.get('/api/getRawMaterial', middleware.checkToken, function (req, res) {
    rm.getRawMaterial()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get raw material list");
        });
});

app.get('/api/CheckItemSku', middleware.checkToken, function (req, res) {
    var sku = req.query.sku
    rm.checkSku(sku)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to check SKU");
        });
});

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false });
app.post('/api/addRawMaterial', [middleware.checkToken, jsonParser], function (req, res) {
    rm.addRawMaterial(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to add raw material");
        });
});

app.post('/api/removeRawMaterial', [middleware.checkToken, jsonParser], function (req, res) {
    rm.removeRawMaterial(req.body)
        .then((result) => {
            if(result){
                rm.removeRawMaterial2(req.body)
                    .then((result) => {
                        res.send(result);
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).send("Failed to remove raw material");
                    });
            }
            else {
                res.status(500).send("Failed to remove raw material");
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to remove raw material");
        });
});

app.put('/api/updateRawMaterial', [middleware.checkToken, jsonParser], function (req, res) {
    rm.updateRawMaterial(req.body)
        .then((result) => {
            res.send(result.success);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to update raw material");
        });
});

module.exports = app;