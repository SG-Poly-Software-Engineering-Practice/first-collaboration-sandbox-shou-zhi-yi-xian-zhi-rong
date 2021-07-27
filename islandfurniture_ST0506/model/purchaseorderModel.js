var db = require('./databaseConfig.js');
var PurchaseOrder = require('./purchaseorder.js');
var purchaseOrderDB = {
    getPurchaseOrders: function () {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT p.*,s.SUPPLIERNAME, w.WAREHOUSENAME FROM purchaseorderentity p, '
                        +'warehouseentity w, supplierentity s WHERE p.DESTINATION_ID = w.ID AND p.SUPPLIER_ID = s.ID '
                        +'ORDER BY CREATEDDATE desc';
                    conn.query(sql, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var poList = [];
                            for(var i = 0; i < result.length; i++) {
                                var orders = new PurchaseOrder();
                                orders.id = result[i].ID;
                                orders.createdDate = result[i].CREATEDDATE;
                                orders.expectedReceiveDate = result[i].EXPECTEDRECEIVEDDATE;
                                orders.status = result[i].STATUS;
                                orders.submittedBy = result[i].SUBMITTEDBY;
                                orders.destinationId = result[i].DESTINATION_ID;
                                orders.destinationName = result[i].WAREHOUSENAME;
                                orders.supplierId = result[i].SUPPLIER_ID;
                                orders.supplierName = result[i].SUPPLIERNAME;
                                poList.push(orders);
                            }
                            conn.end();
                            return resolve(poList);
                        }
                    });
                }
            });
        });
    },
    addPurchaseOrder: function (details) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sqlArgs = [new Date(),new Date(details.expectedReceiveDate),'Pending',details.submittedBy,details.warehouse,details.supplier];
                    var sql = 'INSERT INTO purchaseorderentity(CREATEDDATE,EXPECTEDRECEIVEDDATE,STATUS,SUBMITTEDBY,DESTINATION_ID,SUPPLIER_ID)'
                        + 'values(?,?,?,?,?,?)';
                    conn.query(sql, sqlArgs, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.affectedRows > 0) {
                                conn.end();
                                return resolve({success: true, id: result.insertId});
                            }
                        }
                    });
                }
            });
        });
    },
    getPurchaseOrderById: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT p.*,s.SUPPLIERNAME, w.WAREHOUSENAME FROM purchaseorderentity p, '
                        +'warehouseentity w, supplierentity s WHERE p.DESTINATION_ID = w.ID AND p.SUPPLIER_ID = s.ID '
                        +'AND p.id = ? ORDER BY CREATEDDATE desc';
                    conn.query(sql, [id], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var order = new PurchaseOrder();
                            order.id = result[0].ID;
                            order.createdDate = result[0].CREATEDDATE;
                            order.expectedReceiveDate = result[0].EXPECTEDRECEIVEDDATE;
                            order.status = result[0].STATUS;
                            order.submittedBy = result[0].SUBMITTEDBY;
                            order.destinationId = result[0].DESTINATION_ID;
                            order.destinationName = result[0].WAREHOUSENAME;
                            order.supplierId = result[0].SUPPLIER_ID;
                            order.supplierName = result[0].SUPPLIERNAME;
                            conn.end();
                            return resolve(order);
                        }
                    });
                }
            });
        });
    },
    getPurchaseOrderLineItem: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT l.ID as "LINEITEM_ID",l.QUANTITY,i.* FROM purchaseorderentity p, lineitementity l, itementity i, '
                        + 'purchaseorderentity_lineitementity pl WHERE p.ID = pl.PurchaseOrderEntity_ID AND '
                        + 'l.ID = pl.lineItems_ID AND i.ID = l.ITEM_ID AND p.ID = ?';
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
    },
    addPurchaseOrderLineItem: function (details) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'INSERT INTO purchaseorderentity_lineitementity(PurchaseOrderEntity_ID,lineItems_ID)'
                        + 'values(?,?)';
                    conn.query(sql, [details.purchaseOrderId,details.lineItemId], function (err, result) {
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
    updatePurchaseOrderStatus: function (id,status) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'UPDATE purchaseorderentity SET STATUS=? WHERE ID=?';
                    conn.query(sql, [status,id], function (err, result) {
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
    updatePurchaseOrder: function (id,supplier,warehouse,expectedDate) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'UPDATE purchaseorderentity SET EXPECTEDRECEIVEDDATE=?,DESTINATION_ID=?,SUPPLIER_ID=? WHERE ID=?';
                    conn.query(sql, [expectedDate,warehouse,supplier,id], function (err, result) {
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
    removePOLineItem: function (ids) {
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
                    var sql = 'DELETE FROM purchaseorderentity_lineitementity WHERE lineItems_ID IN (' + idString + ')';
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
    removePOLineItem2: function (ids) {
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
                    var sql = 'DELETE FROM lineitementity WHERE ID IN (' + idString + ')';
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
    }
};
module.exports = purchaseOrderDB