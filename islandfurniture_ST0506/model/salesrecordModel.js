var db = require('./databaseConfig.js');
var SalesRecord = require('./salesRecord.js')
var salesRecordDB = {
    insertSalesRecord: function (data) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sqlArgs = [data.price, data.price, new Date(), 'SGD', data.memberId];
                    var sql = 'INSERT INTO salesrecordentity (AMOUNTDUE,AMOUNTPAID,CREATEDDATE,CURRENCY,MEMBER_ID) VALUES (?,?,?,?,?)';
                    conn.query(sql, sqlArgs, function (err, result) {
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
    }
};
module.exports = salesRecordDB