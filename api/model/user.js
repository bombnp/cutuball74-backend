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
 * @param {Function} callback
 * @param {SqlConnection} conn
 */
function getUserFromId(userid, callback, conn) {
  conn = conn || database.getPool();
  conn.query('SELECT * FROM `users` WHERE `id` = ?;', [userid], function (err, results, fields) {
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


/** Save user object to database
  *
  * @param {Object} user
  * @param {Function} callback
  * @param {SqlConnection} conn
  * @param {Boolean} overwrite
  */
function saveUserToDb(user, callback, conn, overwrite) {
  conn = conn || database.getPool();
  let q = 'INSERT INTO `users` (`id`, `name`, `email`, `faculty`, `tel`) VALUES (?, ?, ?, ?, ?);';
  if (overwrite) {
    q = 'REPLACE INTO `users` (`id`, `name`, `email`, `faculty`, `tel`) VALUES (?, ?, ?, ?, ?);';
  }
  conn.query(q, [user.id, user.name, user.email, user.faculty, user.tel], function (error, results, fields) {
    callback(error);
  });
}

module.exports = {getUserFromId, saveUserToDb};
