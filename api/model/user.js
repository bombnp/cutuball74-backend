const database = require('./database.js')


function userFromRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    faculty: row.faculty,
    tel: row.tel
  }
}


/** Get user object from userid
 *
 * @param {String} userid
 * @param {MySQLConnection} db
 * @param {Function} callback
 */
function getUserFromId(userid, callback) {
  database.getPool().query('SELECT * FROM `users` WHERE `id` = ?;', [userid], function (err, results, fields) {
      if (err) {
        callback(err);
        return;
      };

      if (results.length) {
        user = userFromRow(results[0]);
        callback(null, user)
      } else {
        callback(null, null);
      }
    });
}

exports.getUserFromId = getUserFromId;
