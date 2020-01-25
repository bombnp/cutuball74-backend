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
          handleError(res, 500, err.code, err.sqlMessage)
          return
        }
        res.sendStatus(200)
      },
      null,
      true
    )
  })
}
function getUsers(req, res) {
  let data = {
    start: req.query.start,
    end: req.query.end,
    value: req.query.value,
    checkedin: req.query.checkedin
  }
  user.getUsers(data, function(err, users) {
    if (err) {
      handleError(res, 500, err.code, err.sqlMessage)
      return
    }
    res.json(users)
  })
}

function getStat(req, res) {
  user.getStat(function(err, stat) {
    if (err) {
      handleError(res, 500, err.code, err.sqlMessage)
      return
    }
    res.json(stat)
  })
}

function randomizeUser(req, res) {
  user.randomizeUser(function(err, ticket) {
    if (err) {
      if (err.code == 'NO_MORE_USER') {
        handleError(res, 400, err.code, 'No more user left to randomize')
        return
      }
      handleError(res, 500, err.code, err.sqlMessage)
      return
    }
    res.json(ticket)
  })
}

function getRandomHistory(req, res) {
  user.getRandomHistory(function(err, tickets) {
    if (err) {
      handleError(res, 500, err.code, err.sqlMessage)
      return
    }
    res.json(tickets)
  })
}

function clearRandomHistory(req, res) {
  user.clearRandomHistory(function(err) {
    if (err) {
      handleError(res, 500, err.code, err.sqlMessage)
      return
    }
    res.sendStatus(200)
  })
}

function deleteUser(req, res) {
  let id = req.query.id
  if (!id) {
    handleError(res, 400, 'NOPARAM', "Can't delete without ID")
    return
  }
  user.deleteUser(id, function(err) {
    if (err) {
      handleError(res, 500, err.code, err.sqlMessage)
      return
    }
    res.sendStatus(200)
  })
}

module.exports = { ping, editUser, getUsers, getStat, randomizeUser, getRandomHistory, clearRandomHistory, deleteUser }
