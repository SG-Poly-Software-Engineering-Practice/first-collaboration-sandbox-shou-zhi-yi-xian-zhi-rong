var express = require('express');
var app = express();
let middleware = require('./middleware');

var store = require('../model/storeModel.js');

app.get('/api/getItemQuantity', function (req, res) {
    var sku = req.query.sku;
    var storeId = req.query.storeId;
    store.getItemQuantity(sku, storeId)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get item quantity");
        });
});

app.get('/api/getItemQuantityByStoreName', middleware.checkToken, function (req, res) {
    var itemId = req.query.itemId;
    var storeName = req.query.storeName;
    store.getItemQuantityByStoreName(itemId,storeName)
        .then((result) => {
            if(result[0].sum == null || result[0].sum == '') {
                res.send({qty: 0});
            }
            else {
                res.send({qty: result[0].sum});
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get item quantity by store name");
        });
});

app.get('/api/getStoresByCountry/:country', function (req, res) {
    var country = req.params.country;
    store.getStoresByCountry(country)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get stores by country");
        });
});

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false });
app.put('/api/updateItemQuantity', [middleware.checkToken, jsonParser], function (req, res) {
    store.setStoreQuantity(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to update item quantity");
        });
});

module.exports = app;