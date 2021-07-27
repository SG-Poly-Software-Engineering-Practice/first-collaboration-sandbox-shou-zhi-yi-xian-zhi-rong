var express = require('express');
var app = express();
let middleware = require('./middleware');

var warehouse = require('../model/warehouseModel.js');

app.get('/api/getWarehouses', middleware.checkToken, function (req, res) {
    warehouse.getWarehouses()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get warehouses");
        });
});

module.exports = app;