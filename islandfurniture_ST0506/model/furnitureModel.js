var db = require('./databaseConfig.js');
var Furniture = require('./furniture.js');
var furnitureDB = {
    getAllFurniture: function () {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT i.ID as id, i.NAME as name, f.IMAGEURL as imageURL, i.SKU as sku, i.DESCRIPTION as description,'
                            +' i.TYPE as type, i._LENGTH as length, i.WIDTH as width, i.HEIGHT as height, i.CATEGORY as category'
                            +' FROM itementity i, furnitureentity f where i.ID=f.ID and i.ISDELETED=FALSE';
                    conn.query(sql, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var furList = [];
                            for(var i = 0; i < result.length; i++) {
                                var fur = new Furniture();
                                fur.id = result[i].id;
                                fur.name = result[i].name;
                                fur.imageURL = result[i].imageURL;
                                fur.sku = result[i].sku;
                                fur.description = result[i].description;
                                fur.type = result[i].type;
                                fur.length = result[i].length;
                                fur.width = result[i].width;
                                fur.height = result[i].height;
                                fur.category = result[i].category;
                                furList.push(fur);
                            }
                            conn.end();
                            return resolve(furList);
                        }
                    });
                }
            });
        });
    },
    getFurnitureByCat: function (countryId, cat) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    if(countryId == null || countryId == '') {
                        var sql = 'SELECT i.ID as id, i.NAME as name, f.IMAGEURL as imageURL, i.SKU as sku, i.DESCRIPTION as description,'
                            +' i.TYPE as type, i._LENGTH as length, i.WIDTH as width, i.HEIGHT as height, i.CATEGORY as category'
                            +' FROM itementity i, furnitureentity f where i.ID=f.ID and i.ISDELETED=FALSE and i.CATEGORY=?;';
                        conn.query(sql, [cat], function (err, result) {
                            if (err) {
                                conn.end();
                                return reject(err);
                            } else {
                                var furList = [];
                                for(var i = 0; i < result.length; i++) {
                                    var fur = new Furniture();
                                    fur.id = result[i].id;
                                    fur.name = result[i].name;
                                    fur.imageURL = result[i].imageURL;
                                    fur.sku = result[i].sku;
                                    fur.description = result[i].description;
                                    fur.type = result[i].type;
                                    fur.length = result[i].length;
                                    fur.width = result[i].width;
                                    fur.height = result[i].height;
                                    fur.category = result[i].category;
                                    furList.push(fur);
                                }
                                conn.end();
                                return resolve(furList);
                            }
                        });
                    }
                    else {
                        var sql = 'SELECT i.ID as id, i.NAME as name, f.IMAGEURL as imageURL, i.SKU as sku, i.DESCRIPTION as description,'
                            +' i.TYPE as type, i._LENGTH as length, i.WIDTH as width, i.HEIGHT as height, i.CATEGORY as category,'
                            +' ic.RETAILPRICE as price FROM itementity i, furnitureentity f, item_countryentity ic where i.ID=f.ID and'
                            +' i.ID=ic.ITEM_ID and i.ISDELETED=FALSE and ic.COUNTRY_ID=? and i.CATEGORY=?;';
                        conn.query(sql, [countryId, cat], function (err, result) {
                            if (err) {
                                conn.end();
                                return reject(err);
                            } else {
                                var furList = [];
                                for(var i = 0; i < result.length; i++) {
                                    var fur = new Furniture();
                                    fur.id = result[i].id;
                                    fur.name = result[i].name;
                                    fur.imageURL = result[i].imageURL;
                                    fur.sku = result[i].sku;
                                    fur.description = result[i].description;
                                    fur.type = result[i].type;
                                    fur.length = result[i].length;
                                    fur.width = result[i].width;
                                    fur.height = result[i].height;
                                    fur.category = result[i].category;
                                    fur.price = result[i].price;
                                    furList.push(fur);
                                }
                                conn.end();
                                return resolve(furList);
                            }
                        });
                    }
                }
            });
        });
    },
    getFurnitureBySku: function (countryId, sku) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    if(countryId == null || countryId == '') {
                        var sql = 'SELECT i.ID as id, i.NAME as name, f.IMAGEURL as imageURL, i.SKU as sku, i.DESCRIPTION as description,'
                            +' i.TYPE as type, i._LENGTH as length, i.WIDTH as width, i.HEIGHT as height, i.CATEGORY as category'
                            +' FROM itementity i, furnitureentity f where i.ID=f.ID and i.ISDELETED=FALSE and i.SKU=?;';
                        conn.query(sql, [sku], function (err, result) {
                            if (err) {
                                conn.end();
                                return reject(err);
                            } else {
                                var fur = new Furniture();
                                fur.id = result[0].id;
                                fur.name = result[0].name;
                                fur.imageURL = result[0].imageURL;
                                fur.sku = result[0].sku;
                                fur.description = result[0].description;
                                fur.type = result[0].type;
                                fur.length = result[0].length;
                                fur.width = result[0].width;
                                fur.height = result[0].height;
                                fur.category = result[0].category;
                                conn.end();
                                return resolve(fur);
                            }
                        });
                    }
                    else {
                        var sql = 'SELECT i.ID as id, i.NAME as name, f.IMAGEURL as imageURL, i.SKU as sku, i.DESCRIPTION as description,'
                            +' i.TYPE as type, i._LENGTH as length, i.WIDTH as width, i.HEIGHT as height, i.CATEGORY as category,'
                            +' ic.RETAILPRICE as price FROM itementity i, furnitureentity f, item_countryentity ic where i.ID=f.ID and'
                            +' i.ID=ic.ITEM_ID and i.ISDELETED=FALSE and ic.COUNTRY_ID=? and i.SKU=?;';
                        conn.query(sql, [countryId, sku], function (err, result) {
                            if (err) {
                                conn.end();
                                return reject(err);
                            } else {
                                var fur = new Furniture();
                                fur.id = result[0].id;
                                fur.name = result[0].name;
                                fur.imageURL = result[0].imageURL;
                                fur.sku = result[0].sku;
                                fur.description = result[0].description;
                                fur.type = result[0].type;
                                fur.length = result[0].length;
                                fur.width = result[0].width;
                                fur.height = result[0].height;
                                fur.category = result[0].category;
                                fur.price = result[0].price;
                                conn.end();
                                return resolve(fur);
                            }
                        });
                    }
                }
            });
        });
    },
    addFurniture: function (data) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var name = data.name;
                    var category = data.category;
                    var description = data.description;
                    var sku = data.sku;
                    var length = data.length;
                    var width = data.width;
                    var height = data.height;
                    var volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
                    var sqlArgs = ["FurnitureEntity",sku,length,category,description,height,name,"Furniture",volume,width];
                    var sql = 'INSERT INTO itementity(DTYPE,SKU,_LENGTH,CATEGORY,DESCRIPTION,HEIGHT,NAME,TYPE,VOLUME,WIDTH)'
                        + 'values(?,?,?,?,?,?,?,?,?,?)';
                    conn.query(sql, sqlArgs, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.affectedRows > 0) {
                                furnitureDB.addFurniture2(result.insertId, data.imgPath)
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
    addFurniture2: function (id, imgPath) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'INSERT INTO furnitureentity(ID, IMAGEURL) values(?,?)';
                    conn.query(sql, [id,imgPath], function (err, result) {
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
    updateFurniture: function (data) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    conn.end();
                    return reject(err);
                }
                else {
                    var id = data.id;
                    var name = data.name;
                    var category = data.category;
                    var description = data.description;
                    var imgPath = data.imgPath;
                    var sql = 'UPDATE itementity SET NAME=?, CATEGORY=?, DESCRIPTION=? WHERE ID=?';
                    conn.query(sql, [name,category,description,id], function (err, result) {
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
    removeFurniture: function (ids) {
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
                    var sql = 'DELETE FROM furnitureentity WHERE ID IN (' + idString + ')';
                    conn.query(sql, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } 
                        else {
                            if(result.affectedRows > 0) {
                                furnitureDB.removeFurniture2(idString)
                                    .then((result) => {
                                        conn.end();
                                        return resolve(result);
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
    removeFurniture2: function (idString) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'DELETE FROM item_countryentity WHERE ITEM_ID IN (' + idString + ')';
                    conn.query(sql, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } 
                        else {
                            furnitureDB.removeFurniture3(idString)
                                .then((result) => {
                                    conn.end();
                                    return resolve(result);
                                })
                                .catch((err) => {
                                    console.log(err);
                                    conn.end();
                                    return reject(err);
                                });
                        }
                    });
                }
            });
        });
    },
    removeFurniture3: function (idString) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
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
    }
};
module.exports = furnitureDB