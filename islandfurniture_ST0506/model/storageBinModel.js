var db = require('./databaseConfig.js');
var StorageBin = require('./storageBin.js')
var storageBinDB = {
    getInboundStorageBin: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM storagebinentity sb WHERE sb.TYPE="Inbound" AND sb.WAREHOUSE_ID=?';
                    conn.query(sql, [id], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.length == 0) {
                                conn.end();
                                return resolve({success: false});
                            }
                            else {
                                var sb = new StorageBin();
                                sb.id = result[0].ID;
                                sb.length = result[0]._LENGTH;
                                sb.freeVolume = result[0].FREEVOLUME;
                                sb.height = result[0].HEIGHT;
                                sb.name = result[0].NAME;
                                sb.type = result[0].TYPE;
                                sb.volume = result[0].VOLUME;
                                sb.width = result[0].WIDTH;
                                sb.warehouseId = result[0].WAREHOUSE_ID;
                                conn.end();
                                return resolve({success: true, storageBin: sb});
                            }
                        }
                    });
                }
            });
        });
    },
    checkItemExistInStorageBin: function (sbId,itemId) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM storagebinentity_lineitementity WHERE StorageBinEntity_ID = ? AND lineItems_ID IN '
                    + '(SELECT ID FROM lineitementity WHERE ITEM_ID = ?)';
                    conn.query(sql, [sbId,itemId], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.length == 0) {
                                conn.end();
                                return resolve(false);
                            }
                            else {
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
module.exports = storageBinDB