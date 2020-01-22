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
  conn = conn || database.getPool()
  conn.query('SELECT * FROM `users` WHERE `id` = ?;', [userid], function(err, results, fields) {
    if (err) {
      callback(err)
      return
    }

    if (results.length) {
      user = userFromRow(results[0])
      callback(null, user)
    } else {
      callback(null, null)
    }
  })
}

function getUsers(range, callback, conn) {
  conn = conn || database.getPool()
  const start = parseInt(range.start)
  const end = parseInt(range.end)
  conn.query('SELECT * FROM `users` limit ?,?;', [start, end - start + 1], function(err, results, fields) {
    if (err) {
      callback(err)
      return
    }

    users = results.map(userFromRow)
    callback(null, users)
  })
}

/** Save user object to database
 *
 * @param {Object} user
 * @param {Function} callback
 * @param {SqlConnection} conn
 * @param {Boolean} overwrite
 */
function saveUserToDb(user, callback, conn, overwrite) {
  conn = conn || database.getPool()
  let q = 'INSERT INTO `users` (`id`, `name`, `email`, `faculty`, `tel`) VALUES (?, ?, ?, ?, ?);'
  if (overwrite) {
    // q = 'REPLACE INTO `users` (`id`, `name`, `email`, `faculty`, `tel`) VALUES (?, ?, ?, ?, ?);'
    q = 'UPDATE `users` SET `name` = ?, `email` = ?, `faculty` = ?, `tel` = ? WHERE `id` = ?;'
  }
  conn.query(q, [user.name, user.email, user.faculty, user.tel, user.id], function(error, results, fields) {
    callback(error)
  })
}

module.exports = { getUserFromId, getUsers, saveUserToDb }
