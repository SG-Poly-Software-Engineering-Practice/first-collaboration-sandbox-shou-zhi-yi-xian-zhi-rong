var express = require('express');
var app = express();
var member = require('../model/memberModel.js');
var salesRecord = require('../model/salesrecordModel.js');
var lineItem = require('../model/lineitemModel.js');
var salesRecord_lineItem = require('../model/salesrecord_lineitemModel.js');
var deliveryDetails = require('../model/deliveryDetailsModel.js');
var stripe = require("stripe")("sk_test_fHytNQpl6Bjt3Yo4ppWGgpU6");
let middleware = require('./middleware');

app.get('/api/getStripeCustomer', middleware.checkToken, function (req, res) {
    var email = req.query.email;
    member.getMember(email)
        .then((result) => {
            if (result.stripeCustomerId == null || result.stripeCustomerId == "") {
                res.send({ success: false });
            }
            else {
                stripe.customers.retrieve(result.stripeCustomerId,
                    function (err, customer) {
                        if (err == null || err == '') {
                            res.send({ success: true, customer: customer });
                        }
                        else {
                            res.status(500).send("Failed to get stripe customer id");
                        }
                    }
                );
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get member");
        });
});

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false });
app.post('/api/processPaymentNewCard', [middleware.checkToken, jsonParser], function (req, res) {
    var memberId = req.body.memberId;
    var saveCard = req.body.saveCard;
    var email = req.body.email;
    var token = req.body.token;
    var price = req.body.price;
    
    if (saveCard) {
        var customer = null;
        stripe.customers.list(
            { email: email },
            async function (err, customers) {
                if (err == null || err == '') {
                    if (customers.data == null || customers.data == "") {
                        customer = await stripe.customers.create({
                            email: email
                        });
                        member.updateMemberStripeCustomerId(email, customer.id).then((result) => {
                            if (!result.success) {
                                res.send({ success: false, errMsg: "Failed to update member's stripe customer ID" });
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).send("Failed to update member's stripe customer id");
                        });
                    }
                    else {
                        customer = customers.data[0];
                    }
                    stripe.customers.createSource(customer.id, { source: token.id });
                }
                else {
                    res.status(500).send("Failed to get stripe customer");
                }
            }
        );
    }

    stripe.charges.create({
        amount: price * 100,
        currency: "sgd",
        description: "Island Furniture Purchase",
        source: 'tok_visa'
    }).then(
        function (result) {
            var data = {
                memberId: memberId,
                email: email,
                price: price,
                shoppingCart: req.body.shoppingCart,
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address,
                postalCode: req.body.postalCode,
                deliveryDate: req.body.deliveryDate
            };
            insertDbRecords(data, res);
        },
        function (err) {
            res.send({ success: false, errMsg: err.message });
        }
    );
});

app.post('/api/processPaymentExistingCard', [middleware.checkToken, jsonParser], function (req, res) {
    var memberId = req.body.memberId;
    var email = req.body.email;
    var price = req.body.price;
    var cardId = req.body.cardId;
    var customerId = req.body.customerId;

    stripe.customers.retrieve(customerId,
        function(err, customer) {
            if (err == null || err == '') {
                stripe.charges.create({
                    amount: price * 100,
                    currency: "sgd",
                    description: "Island Furniture Purchase",
                    customer: customer.id,
                    source: cardId
                }).then(
                    function (result) {
                        var data = {
                            memberId: memberId,
                            email: email,
                            price: price,
                            shoppingCart: req.body.shoppingCart,
                            name: req.body.name,
                            phone: req.body.phone,
                            address: req.body.address,
                            postalCode: req.body.postalCode,
                            deliveryDate: req.body.deliveryDate
                        };
                        insertDbRecords(data, res);
                    },
                    function (err) {
                        res.send({ success: false, errMsg: err.message });
                    }
                );
            }
            else {
                res.status(500).send("Failed to get stripe customer");
            }
        }
    );
});

app.post('/api/insertLineItemRecord', [middleware.checkToken, jsonParser], function (req, res) {
    var quantity = req.body.quantity;
    var id = req.body.id;

    lineItem.insertLineItemRecord(quantity, id)
        .then((lineItem) => {
            if(lineItem.success) {
                res.send({success: true, lineItemId: lineItem.generatedId});
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to insert line item record");
        });
});

app.post('/api/insertSalesRecordLineItemRecord', [middleware.checkToken, jsonParser], function (req, res) {
    var salesRecordId = req.body.salesRecordId;
    var lineItemId = req.body.lineItemId;

    salesRecord_lineItem.insertSalesRecordLineItemRecord(salesRecordId, lineItemId)
        .then((salesRecord_lineItem) => {
            res.send(salesRecord_lineItem.success);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to insert sales record line item record");
        });
});

app.post('/api/addDeliveryDetails/', [middleware.checkToken, jsonParser], function (req, res) {
    deliveryDetails.addDeliveryDetails(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to add delivery details");
        });
});

app.post('/api/deleteCard/', [middleware.checkToken, jsonParser], function (req, res) {
    var cardId = req.body.cardId;
    var customerId = req.body.customerId;
    stripe.customers.deleteCard(customerId, cardId,
        function (err, confirmation) {
            if (confirmation.deleted) {
                res.send({ success: true });
            }
            else {
                res.send({ success: false, errMsg: "error deleting card" });
            }
        }
    );
});

module.exports = app;

function insertDbRecords(data, res) {
    salesRecord.insertSalesRecord(data)
        .then((salesRecord) => {
            if(salesRecord.success) {
                res.send({success: true, generatedId: salesRecord.generatedId});
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to insert sales record");
        });
}