var db = require('./databaseConfig.js');
var ManufacturingfacilityDB = {
    getFacilityNameById: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM manufacturingfacilityentity m WHERE m.ID=?';
                    conn.query(sql, [id], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            conn.end();
                            return resolve(result[0].NAME);
                        }
                    });
                }
            });
        });
    }
};
module.exports = ManufacturingfacilityDB