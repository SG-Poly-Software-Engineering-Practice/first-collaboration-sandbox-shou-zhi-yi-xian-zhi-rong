var express = require('express');
var app = express();
let middleware = require('./middleware');

var supplier = require('../model/supplierModel.js');

app.get('/api/getSuppliers', middleware.checkToken, function (req, res) {
    supplier.getSuppliers()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get suppliers");
        });
});

app.get('/api/getSupplierItemById/:id', middleware.checkToken, function (req, res) {
    var id = req.params.id;
    supplier.getSupplierItemById(id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get supplier item by id");
        });
});

app.get('/api/getSupplierItemList/:id', middleware.checkToken, function (req, res) {
    var id = req.params.id;
    supplier.getSupplierItemList(id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get supplier item list");
        });
});

module.exports = app;