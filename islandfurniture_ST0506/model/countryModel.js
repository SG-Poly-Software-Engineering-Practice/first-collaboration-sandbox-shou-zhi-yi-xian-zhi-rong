var db = require('./databaseConfig.js');
var Country = require('./country.js');
var CountryItemPrice = require('./countryItemPrice.js');
var countryDB = {
    getCountryByName: function (name) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM countryentity c WHERE c.NAME=?';
                    conn.query(sql, [name], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var country = new Country();
                            country.id = result[0].ID;
                            country.countryCode = result[0].COUNTRYCODE;
                            country.currency = result[0].CURRENCY;
                            country.exchangeRate = result[0].EXCHANGERATE;
                            country.name = result[0].NAME;
                            conn.end();
                            return resolve(country);
                        }
                    });
                }
            });
        });
    },
    getAllCountries: function () {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM countryentity c';
                    conn.query(sql, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var countryList = [];
                            for(var i = 0; i < result.length; i++) {
                                var country = new Country();
                                country.id = result[i].ID;
                                country.name = result[i].NAME;
                                countryList.push(country);
                            }
                            conn.end();
                            return resolve(countryList);
                        }
                    });
                }
            });
        });
    },
    getAllItems: function () {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT ic.ITEM_ID, i.SKU, c.ID, c.NAME, ic.COUNTRY_ID, ic.RETAILPRICE FROM itementity i,'
                        + 'item_countryentity ic, countryentity c WHERE ic.COUNTRY_ID = c.ID and i.ID = ic.ITEM_ID';
                    conn.query(sql, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var itemPriceList = [];
                            for(var i = 0; i < result.length; i++) {
                                var countryItemPrice = new CountryItemPrice();
                                countryItemPrice.itemId = result[i].ITEM_ID;
                                countryItemPrice.sku = result[i].SKU;
                                countryItemPrice.countryId = result[i].ID;
                                countryItemPrice.countryName = result[i].NAME;
                                countryItemPrice.retailPrice = result[i].RETAILPRICE;
                                itemPriceList.push(countryItemPrice);
                            }
                            conn.end();
                            return resolve(itemPriceList);
                        }
                    });
                }
            });
        });
    },
    getItemIdBySku: function (sku) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT ID FROM itementity WHERE SKU=?';
                    conn.query(sql, [sku], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            conn.end();
                            return resolve(result[0].ID);
                        }
                    });
                }
            });
        });
    },
    checkPriceExist: function (itemId,countryId) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM item_countryentity WHERE ITEM_ID=? and COUNTRY_ID=?';
                    conn.query(sql, [itemId,countryId], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            conn.end();
                            if(result.length == 0) {
                                return resolve(true);
                            }
                            else {
                                return resolve(false);
                            }
                        }
                    });
                }
            });
        });
    },
    addItemPrice: function (countryId,itemId,price) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'INSERT INTO item_countryentity(RETAILPRICE,ITEM_ID,COUNTRY_ID) values(?,?,?)';
                    conn.query(sql, [price,itemId,countryId], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.affectedRows > 0) {
                                conn.end();
                                return resolve(true);
                            }
                        }
                    });
                }
            });
        });
    },
    removeItemPricing: function (ids) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var idString = '';
                    for(i = 0; i < ids.length; i++) {
                        idString += ids[i] + ',';
                    }
                    idString = idString.substr(0, idString.length - 1);
                    var sql = 'DELETE FROM item_countryentity WHERE (ITEM_ID,COUNTRY_ID) IN (' + idString + ')';
                    conn.query(sql, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } 
                        else {
                            if(result.affectedRows > 0) {
                                conn.end();
                                return resolve(true);
                            }
                        }
                    });
                }
            });
        });
    },
    updateItemPrice: function (details) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var itemId = details.itemId;
                    var countryId = details.countryId;
                    var price = details.price;
                    var sql = 'UPDATE item_countryentity SET RETAILPRICE=? WHERE ITEM_ID=? and COUNTRY_ID=?';
                    var sqlArgs = [price,itemId,countryId];
                    conn.query(sql, sqlArgs, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.affectedRows > 0) {
                                conn.end();
                                return resolve(true);
                            }
                        }
                    });
                }
            });
        });
    }
};
module.exports = countryDB