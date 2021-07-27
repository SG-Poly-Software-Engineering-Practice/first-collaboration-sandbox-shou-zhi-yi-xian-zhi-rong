var express = require('express');
var app = express();
let middleware = require('./middleware');

var lineItem = require('../model/lineitemModel.js');

app.get('/api/getLineItemById/:id', middleware.checkToken, function (req, res) {
    var id = req.params.id;
    lineItem.getLineItemById(id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get line item by id");
        });
});

app.get('/api/getOutboundBinLineItem/:id', middleware.checkToken, function (req, res) {
    var id = req.params.id;
    lineItem.getOutboundBinLineItem(id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get outbound bin line item");
        });
});

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false });
app.post('/api/addLineItem', [middleware.checkToken, jsonParser], function (req, res) {
    var quantity = req.body.quantity;
    var itemId = req.body.itemId;
    lineItem.insertLineItemRecord(quantity,itemId)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to add line item");
        });
});

app.post('/api/addQuantityToLineItem', [middleware.checkToken, jsonParser], function (req, res) {
    var lineItemId = req.body.lineItemId;
    var quantity = req.body.quantity;
    lineItem.getLineItemById(lineItemId)
        .then((result) => {
            if(result.length > 0) {
                lineItem.updateLineItem(lineItemId,result[0].QUANTITY + quantity)
                    .then((result) => {
                        res.send(result);
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).send("Failed to update line item");
                    });
            }  
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to add quantity to line item");
        });
});

app.post('/api/addStorageBinLineItem', [middleware.checkToken, jsonParser], function (req, res) {
    var lineItemId = req.body.lineItemId;
    var storageBinId = req.body.storageBinId;
    lineItem.insertStorageBinLineItemRecord(lineItemId,storageBinId)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to add storage bin line item");
        });
});

app.put('/api/updateLineItem', [middleware.checkToken, jsonParser], function (req, res) {
    var lineItemId = req.body.lineItemId;
    var quantity = req.body.quantity;
    lineItem.updateLineItem(lineItemId,quantity)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to update line item");
        });
});

module.exports = app;