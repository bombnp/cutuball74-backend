const { validateUserJson } = require('../util/validation.js')
const user = require('../model/user.js')
const { handleError } = require('./error.js')
const { userJsonToUserObj } = require('./users.js')
function ping(req, res) {
  res.send('pong')
}
function editUser(req, res) {
  let data = req.body
  validateUserJson(data, function(validationerr) {
    if (validationerr) {
      handleError(res, 400, 'VALIDATIONERR', validationerr)
      return
    }
    user.saveUserToDb(
      userJsonToUserObj(data),
      function(err) {
        if (err) {
          throw err
        }
        res.sendStatus(200)
      },
      null,
      true
    )
  })
}
function getUsers(req, res) {
  let data = { start: req.query.start, end: req.query.end }
  user.getUsers(data, function(err, users) {
    if (err) throw err
    res.json(users)
  })
}
function queryUser(req, res) {
  let data = { column: req.query.column, value: req.query.value }
  user.queryUser(data, function(err, users) {
    if (err) throw err
    res.json(users)
  })
}

module.exports = { ping, editUser, getUsers, queryUser }
