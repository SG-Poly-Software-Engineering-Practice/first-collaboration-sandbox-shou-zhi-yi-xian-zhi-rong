var express = require('express');
var app = express();
let middleware = require('./middleware');

var sb = require('../model/storageBinModel.js');

app.get('/api/getInboundStorageBin/:id', middleware.checkToken, function (req, res) {
    var id = req.params.id;
    sb.getInboundStorageBin(id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get inbound storage bin");
        });
});

app.get('/api/checkItemExistInStorageBin', middleware.checkToken, function (req, res) {
    var storageBinId = req.query.storageBinId;
    var itemId = req.query.itemId;
    sb.checkItemExistInStorageBin(storageBinId,itemId)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to check item exist in storage bin");
        });
});

module.exports = app;