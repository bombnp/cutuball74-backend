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

function getStat(req, res) {
  user.getStat(function(err, stat) {
    if (err) throw err
    res.json(stat)
  })
}

function randomizeUser(req, res) {
  user.randomizeUser(function(err, ticket) {
    if(err) throw err;
    res.json(ticket);
  })
}

function getRandomHistory(req, res) {
  user.getRandomHistory(function(err, tickets) {
    if(err) throw err;
    res.json(tickets);
  })
}

function clearRandomHistory(req, res) {
  user.clearRandomHistory(function(err) {
    if(err) throw err;
    res.sendStatus(200);
  })
}

function deleteUser(req, res) {
  let id = req.query.id
  if(!id)
  {
    handleError(res, 400, 'NOIDERR', "Can't delete without ID")
    return;
  }
  user.deleteUser(id, function(err) {
    if (err) throw err
    res.sendStatus(200)
  })
}

module.exports = { ping, editUser, getUsers, queryUser, getStat, randomizeUser, getRandomHistory , clearRandomHistory, deleteUser}
