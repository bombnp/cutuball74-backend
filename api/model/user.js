const database = require('./database.js')

function userFromRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    faculty: row.faculty,
    tel: row.tel,
    number: row.number
  }
}

function ticketFromRow(row) {
  return {
    name: row.name,
    number: row.number
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
  let start=1,end=999999;
  if(range.start && range.start > 0)
    start = parseInt(range.start);
  if(range.end)
    end = parseInt(range.end);

  conn.query('SELECT * FROM `users` LIMIT ?,?;', [start - 1, end - start + 1], function(err, results, fields) {
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
  conn = conn || database.getPool();
  let q = 'INSERT INTO `users` (`id`, `name`, `email`, `faculty`, `tel`) VALUES (?, ?, ?, ?, ?);'
  if (overwrite) {
    q = 'UPDATE `users` SET `name` = ?, `email` = ?, `faculty` = ?, `tel` = ? WHERE `id` = ?;'
  }
  conn.query(q, [user.name, user.email, user.faculty, user.tel, user.id], function(error, results, fields) {
    callback(error)
  })
}

function queryUser(data, callback, conn) {
  conn = conn || database.getPool();
  q = 'SELECT * FROM `users` WHERE ?? LIKE ?;'
  let value = '%' + data.value + '%'
  conn.query(q, [data.column, value], function(err, results, fields) {
    if (err) {
      callback(err)
      return
    }
    users = results.map(userFromRow)
    callback(null, users)
  })
}

function getStat(callback, conn) {
  conn = conn || database.getPool();
  q = 'SELECT(SELECT COUNT(*) FROM `users`) AS `regist`,(SELECT COUNT(*) FROM `checkedin_users`) AS `checkedin`;'
  conn.query(q, [], function(err, results, fields) {
    if (err) {
      callback(err)
      return
    }
    stat = { regist: results[0].regist, checkin: results[0].checkedin }
    callback(null, stat)
  })
}

function randomizeUser(callback, conn) {
  conn = conn || database.getPool();

  // get number of unselected users
  q1 = "SELECT(SELECT COUNT(*) FROM checkedin_users) AS checkedin_count,(SELECT COUNT(*) FROM selected_users) AS selected_count;";
  conn.query(q1, function(err, results, fields) {
    if(err) {
      callback(err);
      return;
    }

    if(results[0].checkedin_count == results[0].selected_count)
      throw "No more user to randomize";

    // select unselected users
    q2 = "SELECT checkedin_users.id, checkedin_users.name, checkedin_users.email, checkedin_users.faculty, checkedin_users.tel, checkedin_users.number FROM checkedin_users LEFT JOIN selected_users ON checkedin_users.number = selected_users.number WHERE selected_users.number IS NULL LIMIT 1 OFFSET ?;";
    conn.query(q2, [Math.floor(Math.random() * (results[0].checkedin_count - results[0].selected_count))], function(err, results, fields) {
      if(err) {
        callback(err);
        return;
      }

      users = results.map(userFromRow);
      ticket = results.map(ticketFromRow)[0];

      q3 = "INSERT INTO selected_users (id, name, email, faculty, tel, number) VALUES (?, ?, ?, ?, ?, ?);";
      conn.query(q3, [users[0].id, users[0].name, users[0].email, users[0].faculty, users[0].tel, users[0].number], function(err, results, fields) {
        if(err) {
          callback(err);
          return;
        }

        
        callback(null, ticket);
      })
    })
  })
}

function getRandomHistory(callback, conn) {
  conn = conn || database.getPool();

  q = "SELECT number, name FROM selected_users;";
  conn.query(q, function(err, results, fields) {
    if(err){
      callback(err);
      return;
    }
    tickets = results.map(ticketFromRow);
    callback(null, tickets);
  })
}

function clearRandomHistory(callback, conn) {
  conn = conn || database.getPool();
  conn.query("TRUNCATE TABLE selected_users;", function(err, results, fields) {
    callback(err);
  });
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

module.exports = { getUserFromId, getUsers, saveUserToDb, queryUser, getStat, randomizeUser, clearRandomHistory, getRandomHistory, deleteUser }
