var db = require('./databaseConfig.js');
var Warehouse = require('./warehouse.js');
var WarehouseModelDB = {
    getWarehouses: function () {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM warehouseentity';
                    conn.query(sql, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var warehouseList = [];
                            for(var i = 0; i < result.length; i++) {
                                var warehouse = new Warehouse();
                                warehouse.id = result[i].ID;
                                warehouse.address = result[i].ADDRESS;
                                warehouse.email = result[i].EMAIL;
                                warehouse.isDeleted = result[i].ISDELETED;
                                warehouse.telephone = result[i].TELEPHONE;
                                warehouse.warehouseName = result[i].WAREHOUSENAME;
                                warehouse.countryId = result[i].COUNTRY_ID;
                                warehouse.regionalOfficeId = result[i].REGIONALOFFICE_ID;
                                warehouseList.push(warehouse);
                            }
                            conn.end();
                            return resolve(warehouseList);
                        }
                    });
                }
            });
        });
    },
    getWarehouseNameById: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM warehouseentity w WHERE w.ID=?';
                    conn.query(sql, [id], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            conn.end();
                            return resolve(result[0].WAREHOUSENAME);
                        }
                    });
                }
            });
        });
    }
};
module.exports = WarehouseModelDB