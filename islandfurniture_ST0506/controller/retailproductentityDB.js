var express = require('express');
var app = express();
let middleware = require('./middleware');
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './view/img/products/')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.sku + '.jpg')
    }
});
var upload = multer({ storage: storage });
var product = require('../model/retailproductModel.js');

app.get('/api/getRetailProductByCat', function (req, res) {
    var cat = req.query.cat;
    var countryId = req.query.countryId;
    product.getRetailProductByCat(cat, countryId)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get retail product list");
        });
});

app.get('/api/getRetailProductBySku', function (req, res) {
    var sku = req.query.sku;
    var countryId = req.query.countryId;
    product.getRetailProductBySku(countryId, sku)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get retail product by sku");
        });
});

app.get('/api/getAllRetailProducts', middleware.checkToken, function (req, res) {
    product.getAllRetailProducts()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get all retail product");
        });
});

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false });
app.post('/api/addRetailProduct', upload.single('imgfile'), function (req, res) {
    var name = req.body.name;
    var category = req.body.category;
    var description = req.body.description;
    var sku = req.body.sku;
    var length = req.body.length;
    var width = req.body.width;
    var height = req.body.height;

    var data = {
        name: name,
        category: category,
        description: description,
        sku: sku,
        length: length,
        width: width,
        height: height,
        imgPath: '/img/products/' + sku + '.jpg'
    };
    product.addRetailProduct(data)
        .then((result) => {
            if(result.success) {
                res.redirect('/A6/retailProductManagement_Add.html?goodMsg=Retail Product with SKU "' + result.sku + '" has been created successfully.')
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to add retail product");
        });
});

app.post('/api/removeRetailProduct', [middleware.checkToken, jsonParser], function (req, res) {
    product.removeRetailProduct(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to remove retail product");
        });
});

app.post('/api/updateRetailProduct', upload.single('imgfile'), function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var category = req.body.category;
    var description = req.body.description;
    
    var data = {
        id: id,
        name: name,
        category: category,
        description: description
    };
    product.updateRetailProduct(data)
        .then((result) => {
            if(result) {
                res.redirect('/A6/retailProductManagement.html?goodMsg=Retail Product updated successfully.')
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to update retail product");
        });
});

module.exports = app;