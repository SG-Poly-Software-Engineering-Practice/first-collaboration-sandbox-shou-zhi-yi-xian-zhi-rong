var db = require('./databaseConfig.js');
var DeliveryDetails = require('./deliverydetails.js')
var deliveryDetailsDB = {
    addDeliveryDetails: function (data) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sqlArgs = [data.memberId,data.address,data.postalCode,data.contactNum,data.name,data.salesRecordId];
                    var sql = 'INSERT INTO deliverydetailsentity (MEMBER_ID,DELIVERY_ADDRESS,POSTAL_CODE,CONTACT,NAME,SALERECORD_ID) VALUES (?,?,?,?,?,?)';
                    conn.query(sql, sqlArgs, function (err, result) {
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
    }
};
module.exports = deliveryDetailsDB