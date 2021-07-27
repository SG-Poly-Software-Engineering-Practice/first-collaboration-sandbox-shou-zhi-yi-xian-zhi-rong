var db = require('./databaseConfig.js');
var ShippingOrder = require('./shippingorder.js')
var shippingOrderDB = {
    getShippingOrders: function () {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT s.*,w.WAREHOUSENAME as "DESTINATION_NAME",w2.WAREHOUSENAME as "ORIGIN_NAME" '
                        + 'FROM shippingorderentity s, warehouseentity w, warehouseentity w2 '
                        + 'WHERE s.DESTINATION_ID = w.ID AND s.ORIGIN_ID = w2.ID';
                    conn.query(sql, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var soList = [];
                            for(var i = 0; i < result.length; i++) {
                                var orders = new ShippingOrder();
                                orders.id = result[i].ID;
                                orders.createdDate = result[i].CREATEDDATE;
                                orders.expectedReceiveDate = result[i].EXPECTEDRECEIVEDDATE;
                                orders.receivedDate = result[i].RECEIVEDDATE;
                                orders.shippedDate = result[i].SHIPPEDDATE;
                                orders.status = result[i].STATUS;
                                orders.submittedBy = result[i].SUBMITTEDBY;
                                orders.destinationId = result[i].DESTINATION_ID;
                                orders.destinationName = result[i].DESTINATION_NAME;
                                orders.originId = result[i].ORIGIN_ID;
                                orders.originName = result[i].ORIGIN_NAME;
                                soList.push(orders);
                            }
                            conn.end();
                            return resolve(soList);
                        }
                    });
                }
            });
        });
    },
    getShippingOrderById: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT s.*,w.WAREHOUSENAME as "DESTINATION_NAME",w2.WAREHOUSENAME as "ORIGIN_NAME" '
                        + 'FROM shippingorderentity s, warehouseentity w, warehouseentity w2 '
                        + 'WHERE s.DESTINATION_ID = w.ID AND s.ORIGIN_ID = w2.ID AND s.ID = ?';
                    conn.query(sql, [id], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var order = new ShippingOrder();
                            order.id = result[0].ID;
                            order.createdDate = result[0].CREATEDDATE;
                            order.expectedReceiveDate = result[0].EXPECTEDRECEIVEDDATE;
                            order.receivedDate = result[0].RECEIVEDDATE;
                            order.shippedDate = result[0].EXPECTEDRECEIVEDDATE;
                            order.status = result[0].STATUS;
                            order.submittedBy = result[0].SUBMITTEDBY;
                            order.destinationId = result[0].DESTINATION_ID;
                            order.destinationName = result[0].DESTINATION_NAME;
                            order.originId = result[0].ORIGIN_ID;
                            order.originName = result[0].ORIGIN_NAME;
                            conn.end();
                            return resolve(order);
                        }
                    });
                }
            });
        });
    },
    getShippingOrderLineItem: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT l.ID as "LINEITEM_ID",l.QUANTITY,i.* FROM shippingorderentity s, lineitementity l, itementity i, '
                        + 'shippingorderentity_lineitementity sl WHERE s.ID = sl.ShippingOrderEntity_ID AND '
                        + 'l.ID = sl.lineItems_ID AND i.ID = l.ITEM_ID AND s.ID = ?';
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
    addShippingOrder: function (details) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sqlArgs = [new Date(),new Date(details.expectedReceiveDate),'Pending',details.submittedBy,details.destination,details.source];
                    var sql = 'INSERT INTO shippingorderentity(CREATEDDATE,EXPECTEDRECEIVEDDATE,STATUS,SUBMITTEDBY,DESTINATION_ID,ORIGIN_ID)'
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
    addShippingOrderLineItem: function (details) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'INSERT INTO shippingorderentity_lineitementity(ShippingOrderEntity_ID,lineItems_ID)'
                        + 'values(?,?)';
                    conn.query(sql, [details.shippingOrderId,details.lineItemId], function (err, result) {
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
    updateShippingOrder: function (id,destination,source,expectedDate) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'UPDATE shippingorderentity SET EXPECTEDRECEIVEDDATE=?,DESTINATION_ID=?,ORIGIN_ID=? WHERE ID=?';
                    conn.query(sql, [expectedDate,destination,source,id], function (err, result) {
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
    updateShippingOrderStatus: function (id,status) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'UPDATE shippingorderentity SET STATUS=? WHERE ID=?';
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
    updateShippingOrderShippedDate: function (id,date) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'UPDATE shippingorderentity SET SHIPPEDDATE=? WHERE ID=?';
                    conn.query(sql, [date,id], function (err, result) {
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
    removeSOLineItem: function (ids) {
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
                    var sql = 'DELETE FROM shippingorderentity_lineitementity WHERE lineItems_ID IN (' + idString + ')';
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
    removeSOLineItem2: function (ids) {
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
module.exports = shippingOrderDB