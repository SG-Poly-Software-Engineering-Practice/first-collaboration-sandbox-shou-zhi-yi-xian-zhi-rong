var db = require('./databaseConfig.js');
var Staff = require('./staff.js');
var StaffRoles = require('./staffRoles.js');
var manufacturingFacilityDB = require('./manufacturingfacilityModel.js');
var regionalOfficeDB = require('./regionalofficeModel.js');
var storeDB = require('./storeModel.js');
var warehouseDB = require('./warehouseModel.js');
//var crypto = require('crypto');
var bcrypt = require('bcrypt');
//var nodemailer = require('nodemailer');
let jwt = require('jsonwebtoken');
let config = require('./config');
var staffDB = {
    checkStaffLogin: function (email, password) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM staffentity s WHERE s.EMAIL=?';
                    conn.query( sql, [email], (err, result) => {
                        if (err){
                            conn.end();
                            return reject(err);
                        }
                        else {
                            if(result == null || result == undefined || result == '') {
                                conn.end();
                                return resolve({success:false});
                            }
                            var staff = new Staff();
                            staff.email = result[0].EMAIL;
                            staff.passwordHash = result[0].PASSWORDHASH;

                            bcrypt.compare(password, staff.passwordHash, function(err, res) {
                                if(res) {
                                    var token = jwt.sign({username: staff.email},
                                        config.secret,
                                        { 
                                            expiresIn: '12h'
                                        }
                                    );
                                    conn.end();
                                    return resolve({success:true, email: staff.email, token: token});
                                } else {
                                    conn.end();
                                    return resolve({success:false});
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    getStaffLockState: function (email) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM staffentity s WHERE s.EMAIL=?';
                    conn.query(sql, [email], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var staff = new Staff();
                            staff.accountLockStatus = result[0].ACCOUNTLOCKSTATUS;
                            conn.end();
                            return resolve(staff);
                        }
                    });
                }
            });
        });
    },
    getStaff: function (email) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM staffentity s WHERE s.EMAIL=?';
                    conn.query(sql, [email], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var staff = new Staff();
                            staff.id = result[0].ID;
                            staff.accountActivationStatus = result[0].ACCOUNTACTIVATIONSTATUS;
                            staff.accountLockStatus = result[0].ACCOUNTLOCKSTATUS;
                            staff.activationCode = result[0].ACTIVATIONCODE;
                            staff.address = result[0].ADDRESS;
                            staff.email = result[0].EMAIL;
                            staff.identificationNo = result[0].IDENTIFICATIONNO;
                            staff.invalidLoginAttempt = result[0].INVALIDLOGINATTEMPT;
                            staff.name = result[0].NAME;
                            staff.passwordHash = result[0].PASSWORDHASH;
                            staff.passwordReset = result[0].PASSWORDRESET;
                            staff.phone = result[0].PHONE;
                            staff.securityAnswer = result[0].SECURITYANSWER;
                            staff.securityQuestion = result[0].SECURITYQUESTION;
                            staff.countryId = result[0].COUNTRY_ID;
                            conn.end();
                            return resolve(staff);
                        }
                    });
                }
            });
        });
    },
    getStaffRoles: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM roleentity WHERE ID IN (SELECT roles_ID FROM staffentity_roleentity WHERE staffs_ID = ?)';
                    conn.query(sql, [id], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var role = new StaffRoles();
                            role.id = result[0].ID;
                            role.accessLevel = result[0].ACCESSLEVEL;
                            role.name = result[0].NAME;
                            conn.end();
                            return resolve(role);
                        }
                    });
                }
            });
        });
    },
    getStaffAccessRight: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM accessrightentity WHERE STAFF_ID = ?';
                    conn.query(sql, [id], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.length == 0) {
                                conn.end();
                                return resolve("");
                            }
                            else if(result[0].MANUFACTURINGFACILITY_ID != null) {
                                manufacturingFacilityDB.getFacilityNameById(result[0].MANUFACTURINGFACILITY_ID)
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
                            else if(result[0].REGIONALOFFICE_ID != null) {
                                regionalOfficeDB.getOfficeNameById(result[0].REGIONALOFFICE_ID)
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
                            else if(result[0].STORE_ID != null) {
                                storeDB.getStoreNameById(result[0].STORE_ID)
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
                            else if(result[0].WAREHOUSE_ID != null) {
                                warehouseDB.getWarehouseNameById(result[0].WAREHOUSE_ID)
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
    updateStaff: function (details) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var idNo = details.idNo;
                    var name = details.name;
                    var email = details.email;
                    var securityQuestion = details.securityQuestion;
                    var securityAnswer = details.securityAnswer;
                    var phone = details.phone;
                    var address = details.address;
                    var password = details.password;
                    if(password == null || password == '') {
                        var sql = 'UPDATE staffentity SET IDENTIFICATIONNO=?, NAME=?, SECURITYQUESTION=?,'
                            + 'SECURITYANSWER=?, PHONE=?, ADDRESS=? WHERE EMAIL=?';
                        var sqlArgs = [idNo,name,securityQuestion,securityAnswer,phone,address,email];
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
                    else {
                        bcrypt.hash(password, 5, function(err, hash) {
                            var sql = 'UPDATE staffentity SET IDENTIFICATIONNO=?, NAME=?, SECURITYQUESTION=?,'
                            + 'SECURITYANSWER=?, PHONE=?, ADDRESS=?, PASSWORDHASH=? WHERE EMAIL=?';
                            var sqlArgs = [idNo,name,securityQuestion,securityAnswer,phone,address,hash,email];
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
                        });
                    }
                }
            });
        });
    }
};
module.exports = staffDB