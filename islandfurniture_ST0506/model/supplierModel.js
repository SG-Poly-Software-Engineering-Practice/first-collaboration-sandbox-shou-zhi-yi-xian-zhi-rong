var db = require('./databaseConfig.js');
var Supplier = require('./supplier.js');
var SupplierItem = require('./supplierItem.js');
var SupplierModelDB = {
    getSuppliers: function () {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM supplierentity';
                    conn.query(sql, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var supplierList = [];
                            for(var i = 0; i < result.length; i++) {
                                var supplier = new Supplier();
                                supplier.id = result[i].ID;
                                supplier.address = result[i].ADDRESS;
                                supplier.contactNum = result[i].CONTACTNO;
                                supplier.email = result[i].EMAIL;
                                supplier.isDeleted = result[i].ISDELETED;
                                supplier.supplierName = result[i].SUPPLIERNAME;
                                supplier.countryId = result[i].COUNTRY_ID;
                                supplier.regionalOfficeId = result[i].REGIONALOFFICE_ID;
                                supplierList.push(supplier);
                            }
                            conn.end();
                            return resolve(supplierList);
                        }
                    });
                }
            });
        });
    },
    getSupplierItemById: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM supplier_itementity WHERE SUPPLIER_ID = ?';
                    conn.query(sql, [id], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var supplierItemList = [];
                            for(var i = 0; i < result.length; i++) {
                                var supplierItem = new SupplierItem();
                                supplierItem.id = result[i].ID;
                                supplierItem.costprice = result[i].COSTPRICE;
                                supplierItem.isDeleted = result[i].ISDELETED;
                                supplierItem.leadTime = result[i].LEADTIME;
                                supplierItem.lotSize = result[i].LOTSIZE;
                                supplierItem.itemId = result[i].ITEM_ID;
                                supplierItem.supplierId = result[i].SUPPLIER_ID;
                                supplierItemList.push(supplierItem);
                            }
                            conn.end();
                            return resolve(supplierItemList);
                        }
                    });
                }
            });
        });
    },
    getSupplierItemList: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT si.ID,si.COSTPRICE,si.LEADTIME,si.LOTSIZE,si.ITEM_ID,i.SKU,i.NAME,i.TYPE '
                        + 'FROM supplier_itementity si, itementity i WHERE si.ITEM_ID = i.ID AND si.SUPPLIER_ID = ?';
                    conn.query(sql, [id], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            conn.end();
                            return resolve(result);
                        }
                    });
                }
            });
        });
    }
};
module.exports = SupplierModelDB