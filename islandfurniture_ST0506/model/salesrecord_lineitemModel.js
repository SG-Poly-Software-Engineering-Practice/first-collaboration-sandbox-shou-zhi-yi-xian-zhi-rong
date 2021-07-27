var db = require('./databaseConfig.js');
var SalesRecord_lineItem = require('./salesRecord_lineItem.js')
var salesRecord_lineItemDB = {
    insertSalesRecordLineItemRecord: function (transactionRecordId, lineItemId) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'INSERT INTO salesrecordentity_lineitementity (SalesRecordEntity_ID,itemsPurchased_ID) VALUES (?,?)';
                    conn.query(sql, [transactionRecordId,lineItemId], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.affectedRows > 0) {
                                conn.end();
                                return resolve({success: true});
                            }
                        }
                    });
                }
            });
        });
    }
};
module.exports = salesRecord_lineItemDB