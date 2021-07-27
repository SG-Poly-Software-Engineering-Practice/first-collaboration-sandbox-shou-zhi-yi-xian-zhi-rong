var express = require('express');
var app = express();
let middleware = require('./middleware');

var so = require('../model/shippingorderModel.js');

app.get('/api/getShippingOrders', middleware.checkToken, function (req, res) {
    so.getShippingOrders()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get shipping orders");
        });
});

app.get('/api/getShippingOrderById/:id', middleware.checkToken, function (req, res) {
    var id = req.params.id;
    so.getShippingOrderById(id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get shipping order by id");
        });
});

app.get('/api/getShippingOrderLineItem/:id', middleware.checkToken, function (req, res) {
    var id = req.params.id;
    so.getShippingOrderLineItem(id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get shipping order line item");
        });
});

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false });
app.post('/api/addShippingOrder', [middleware.checkToken, jsonParser], function (req, res) {
    so.addShippingOrder(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to add shipping order");
        });
});

app.post('/api/addShippingOrderLineItem', [middleware.checkToken, jsonParser], function (req, res) {
    so.addShippingOrderLineItem(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to add shipping order line item");
        });
});

app.post('/api/removeSOLineItem', [middleware.checkToken, jsonParser], function (req, res) {
    so.removeSOLineItem(req.body)
        .then((result) => {
            if(result){
                so.removeSOLineItem2(req.body)
                    .then((result) => {
                        res.send(result);
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).send("Failed to remove shipping order line item");
                    });
            }
            else {
                res.status(500).send("Failed to remove shipping order line item");
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to remove shipping order line item");
        });
});

app.put('/api/updateShippingOrder', [middleware.checkToken, jsonParser], function (req, res) {
    var id = req.body.id;
    var destination = req.body.destination;
    var source = req.body.source;
    var expectedDate = req.body.expectedDate;
    so.updateShippingOrder(id,destination,source,expectedDate)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to update shipping order");
        });
});

app.put('/api/updateShippingOrderStatus', [middleware.checkToken, jsonParser], function (req, res) {
    var id = req.body.id;
    var status = req.body.status;
    so.updateShippingOrderStatus(id,status)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to update shipping order status");
        });
});

app.put('/api/updateShippingOrderShippedDate', [middleware.checkToken, jsonParser], function (req, res) {
    var id = req.body.id;
    var date = req.body.date;
    so.updateShippingOrderShippedDate(id,date)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to update shipping order shipped date");
        });
});

module.exports = app;