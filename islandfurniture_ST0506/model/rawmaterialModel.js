var db = require('./databaseConfig.js');
var RawMaterial = require('./rawmaterial.js');
var rawMaterialDB = {
    getRawMaterial: function () {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT i.* FROM itementity i, rawmaterialentity r WHERE r.ID = i.ID AND i.ISDELETED=FALSE';
                    conn.query(sql, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var matList = [];
                            for(var i = 0; i < result.length; i++) {
                                var mat = new RawMaterial();
                                mat.id = result[i].ID;
                                mat.dtype = result[i].DTYPE;
                                mat.sku = result[i].SKU;
                                mat.length = result[i]._LENGTH;
                                mat.category = result[i].CATEGORY;
                                mat.description = result[i].DESCRIPTION;
                                mat.height = result[i].HEIGHT;
                                mat.name = result[i].NAME;
                                mat.type = result[i].TYPE;
                                mat.volume = result[i].VOLUME;
                                mat.width = result[i].WIDTH;
                                mat.warehouseId = result[i].WAREHOUSES_ID;
                                matList.push(mat);
                            }
                            conn.end();
                            return resolve(matList);
                        }
                    });
                }
            });
        });
    },
    checkSku: function (sku) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM itementity i WHERE i.SKU = ?';
                    conn.query(sql, [sku], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.length == 0) {
                                conn.end();
                                return resolve({ok: true, sku: sku});
                            }
                            else {
                                conn.end();
                                return resolve({ok: false, sku: sku});
                            }
                        }
                    });
                }
            });
        });
    },
    addRawMaterial: function (material) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var name = material.name;
                    var category = material.category;
                    var description = material.description;
                    var sku = material.sku;
                    var length = material.length;
                    var width = material.width;
                    var height = material.height;
                    var volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
                    var sqlArgs = ["RawMaterialEntity",sku,length,category,description,height,name,"Raw Material",volume,width];
                    var sql = 'INSERT INTO itementity(DTYPE,SKU,_LENGTH,CATEGORY,DESCRIPTION,HEIGHT,NAME,TYPE,VOLUME,WIDTH)'
                        + 'values(?,?,?,?,?,?,?,?,?,?)';
                    conn.query(sql, sqlArgs, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.affectedRows > 0) {
                                rawMaterialDB.addRawMaterial2(result.insertId)
                                    .then((result) => {
                                        conn.end();
                                        return resolve({success: result, sku: sku});
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        conn.end();
                                        return reject(err);
                                    });
                            }
                        }
                    });
                }
            });
        });
    },
    addRawMaterial2: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'INSERT INTO rawmaterialentity(ID) values(?)';
                    conn.query(sql, [id], function (err, result) {
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
    removeRawMaterial: function (ids) {
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
                    var sql = 'DELETE FROM rawmaterialentity WHERE ID IN (' + idString + ')';
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
    removeRawMaterial2: function (ids) {
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
                    var sql = 'DELETE FROM itementity WHERE ID IN (' + idString + ')';
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
    updateRawMaterial: function (details) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var id = details.id;
                    var name = details.name;
                    var category = details.category;
                    var description = details.description;
                    var sql = 'UPDATE itementity SET NAME=?, CATEGORY=?, DESCRIPTION=? WHERE ID=?';
                    var sqlArgs = [name,category,description,id];
                    conn.query(sql, sqlArgs, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.affectedRows > 0) {
                                conn.end();
                                return resolve({success:true});
                            }
                        }
                    });
                }
            });
        });
    }
};
module.exports = rawMaterialDB