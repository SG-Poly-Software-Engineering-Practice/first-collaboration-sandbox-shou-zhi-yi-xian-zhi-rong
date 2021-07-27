var db = require('./databaseConfig.js');
var LineItem = require('./lineItem.js')
var lineItemDB = {
    insertLineItemRecord: function (quantity, itemId) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'INSERT INTO lineitementity (QUANTITY,ITEM_ID) VALUES (?,?)';
                    conn.query(sql, [quantity,itemId], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.affectedRows > 0) {
                                conn.end();
                                return resolve({success: true, generatedId: result.insertId});
                            }
                        }
                    });
                }
            });
        });
    },
    insertStorageBinLineItemRecord: function (lineItemId,storageBinId) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'INSERT INTO storagebinentity_lineitementity (StorageBinEntity_ID,lineItems_ID) VALUES (?,?)';
                    conn.query(sql, [storageBinId,lineItemId], function (err, result) {
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
    getLineItemById: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT l.*,i.SKU FROM lineitementity l, itementity i WHERE l.ITEM_ID = i.ID AND l.ID = ?';
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
    updateLineItem: function (lineItemId,quantity) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'UPDATE lineitementity SET QUANTITY=? WHERE ID=?';
                    conn.query(sql, [quantity,lineItemId], function (err, result) {
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
    getOutboundBinLineItem: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT i.*,l.QUANTITY FROM warehouseentity w, storagebinentity s, storagebinentity_lineitementity sl, lineitementity l, '
                        + 'itementity i WHERE s.WAREHOUSE_ID = w.ID AND sl.StorageBinEntity_ID = s.ID AND sl.lineItems_ID = l.ID '
                        + 'AND s.TYPE = "Outbound" AND i.ID = l.ITEM_ID AND w.ID = ?';
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
module.exports = lineItemDB