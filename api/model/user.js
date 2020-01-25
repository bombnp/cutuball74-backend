const database = require('./database.js')

function userFromRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    faculty: row.faculty,
    tel: row.tel,
    number: row.number,
    role: row.role,
    createdAt: row.createdAt,
    modifiedAt: row.modifiedAt,
    checkedinAt: row.checkedinAt
  }
}

function ticketFromRow(row) {
  return {
    number: row.number,
    name: row.name
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

function getUsers(data, callback, conn) {
  conn = conn || database.getPool()
  let start = 0,
    end = 999999
  if (data.start && data.start >= 0) start = parseInt(data.start)
  if (data.end) end = parseInt(data.end)
  if (!data.value) data.value = ''
  if (!data.checkedin) data.checkedin = false
  else data.checkedin = true
  let checkedin = data.checkedin
  let value = '%' + data.value + '%'
  if (!checkedin) {
    let q1 =
      'SELECT checkedin_users.number,users.id,name,email,faculty,tel,createdAt,modifiedAt,checkedin_users.checkedinAt FROM users LEFT JOIN checkedin_users ON users.id=checkedin_users.id WHERE users.role <> "admin" AND users.role <> "staff" AND (users.id like ? OR name like ? OR email like ? OR tel like ?) ORDER BY createdAt ASC LIMIT ?,?;'
    conn.query(q1, [value, value, value, value, start, end - start], function(err, results, fields) {
      if (err) {
        callback(err)
        return
      }
      let users = results.map(userFromRow)
      let q2 =
        'SELECT COUNT(*) AS users_count FROM `users` LEFT JOIN checkedin_users ON users.id=checkedin_users.id WHERE role <> "admin" AND role <> "staff" AND (users.id like ? OR name like ? OR email like ? OR tel like ?)'
      conn.query(q2, [value, value, value, value], function(err, results, fields) {
        if (err) {
          callback(err)
          return
        }
        let users_count = results[0].users_count
        callback(null, {
          users: users,
          users_count: users_count
        })
      })
    })
  } else {
    let q1 =
      'SELECT checkedin_users.number,users.id,name,email,faculty,tel,createdAt,modifiedAt,checkedin_users.checkedinAt FROM users INNER JOIN checkedin_users ON users.id=checkedin_users.id WHERE (users.id like ? OR name like ? OR email like ? OR tel like ?) ORDER BY number ASC LIMIT ?,?;'
    conn.query(q1, [value, value, value, value, start, end - start], function(err, results, fields) {
      if (err) {
        callback(err)
        return
      }
      let users = results.map(userFromRow)
      let q2 =
        'SELECT COUNT(*) AS checkedin_users_count FROM checkedin_users INNER JOIN users ON users.id=checkedin_users.id WHERE (users.id like ? OR users.name like ? OR users.email like ? OR users.tel like ?)'
      conn.query(q2, [value, value, value, value], function(err, results, fields) {
        if (err) {
          callback(err)
          return
        }
        let users_count = results[0].checkedin_users_count
        callback(null, {
          users: users,
          users_count: users_count
        })
      })
    })
  }
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
  let q = 'INSERT INTO `users` (`name`, `email`, `faculty`, `tel`,`id`) VALUES (?, ?, ?, ?, ?);'
  if (overwrite) {
    q = 'UPDATE `users` SET `name` = ?, `email` = ?, `faculty` = ?, `tel` = ? WHERE `id` = ?;'
  }
  conn.query(q, [user.name, user.email, user.faculty, user.tel, user.id], function(error, results, fields) {
    callback(error)
  })
}

function getStat(callback, conn) {
  conn = conn || database.getPool()
  q =
    'SELECT(SELECT COUNT(*) FROM `users` WHERE role <> "admin" AND role <> "staff") AS `regist`,(SELECT COUNT(*) FROM `checkedin_users`) AS `checkedin`;'
  conn.query(q, [], function(err, results, fields) {
    if (err) {
      callback(err, null)
      return
    }
    stat = { regist: results[0].regist, checkin: results[0].checkedin }
    callback(null, stat)
  })
}

function randomizeUser(callback, conn) {
  conn = conn || database.getPool()

  // get number of unselected users
  q1 = 'SELECT(SELECT COUNT(*) FROM checkedin_users) AS checkedin_count,(SELECT COUNT(*) FROM selected_users) AS selected_count;'
  conn.query(q1, function(err, results, fields) {
    if (err) {
      callback(err)
      return
    }

    if (results[0].checkedin_count == results[0].selected_count) {
      callback({ code: 'NO_MORE_USER' })
      return
    }

    // select unselected users
    q2 =
      'SELECT checkedin_users.number, checkedin_users.id, users.name FROM checkedin_users LEFT JOIN selected_users ON checkedin_users.number = selected_users.number INNER JOIN users ON checkedin_users.id = users.id WHERE selected_users.number IS NULL LIMIT 1 OFFSET ?;'
    conn.query(q2, [Math.floor(Math.random() * (results[0].checkedin_count - results[0].selected_count))], function(err, results, fields) {
      if (err) {
        callback(err)
        return
      }

      user = results.map(userFromRow)[0]
      ticket = results.map(ticketFromRow)[0]

      q3 = 'INSERT INTO selected_users (number, id) VALUES (?, ?);'
      conn.query(q3, [user.number, user.id], function(err, results, fields) {
        if (err) {
          callback(err)
          return
        }

        callback(null, ticket)
      })
    })
  })
}

function getRandomHistory(callback, conn) {
  conn = conn || database.getPool()

  q = 'SELECT selected_users.number, users.name FROM selected_users INNER JOIN users WHERE selected_users.id = users.id ORDER BY selectedAt;'
  conn.query(q, function(err, results, fields) {
    if (err) {
      callback(err)
      return
    }
    tickets = results.map(ticketFromRow)
    callback(null, tickets)
  })
}

function clearRandomHistory(callback, conn) {
  conn = conn || database.getPool()
  conn.query('TRUNCATE TABLE selected_users;', function(err, results, fields) {
    callback(err)
  })
}

function deleteUser(id, callback, conn) {
  conn = conn || database.getPool()
  q = 'DELETE FROM `users` WHERE `id` = ?;'
  conn.query(q, id, function(err, results, fields) {
    if (err) {
      callback(err)
      return
    }
    callback(null)
  })
}

function checkIn(data, callback, conn) {
  conn = conn || database.getPool()
  q1 = 'SELECT COUNT(*) AS found FROM users WHERE id = ?;'
  conn.query(q1, [data.id], function(err, results, fields) {
    if (err) {
      callback(err)
      return
    }
    if (!results[0].found) callback({ code: 'NOID' })
  })
  q2 = 'SELECT COUNT(*) AS dup FROM checkedin_users WHERE id = ?;'
  conn.query(q2, [data.id], function(err, results, fields) {
    if (err) {
      callback(err)
      return
    }
    if (!results[0].dup) {
      q3 = 'INSERT INTO checkedin_users (id) VALUE (?);'
      conn.query(q3, [data.id], function(err, results, fields) {
        if (err) {
          callback(err)
          return
        }
        callback(null)
      })
    } else callback({ code: 'ER_DUP_ENTRY' })
  })
}

function getTicket(id, callback, conn) {
  conn = conn || database.getPool()
  q = 'SELECT checkedin_users.number,users.name FROM users INNER JOIN checkedin_users ON users.id=checkedin_users.id WHERE users.id = ?;'
  conn.query(q, [id], function(err, results, fields) {
    if (err) {
      callback(err)
      return
    }
    if (!results.length) callback({ code: 'NOCHKIN' }, null)
    else {
      data = results.map(ticketFromRow)
      callback(null, data)
    }
  })
}

module.exports = {
  getUserFromId,
  getUsers,
  saveUserToDb,
  getStat,
  randomizeUser,
  clearRandomHistory,
  getRandomHistory,
  deleteUser,
  checkIn,
  getTicket
}
