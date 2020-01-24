const user = require('../model/user.js')
const { validateUserJson } = require('../util/validation.js')
const { handleError } = require('./error.js')

function getUser(req, res) {
  let user = req.user
  let output = {
    ID: user.id,
    name: user.name,
    email: user.email,
    faculty: user.faculty,
    tel: user.tel
  }
  res.json(output)
}

function userJsonToUserObj(data) {
  return {
    id: data.ID,
    name: data.name,
    email: data.email,
    faculty: data.faculty,
    tel: data.tel
  }
}

function register(req, res) {
  let data = req.body

  validateUserJson(data, function(validationerr) {
    if (validationerr) {
      handleError(res, 400, 'VALIDATIONERR', validationerr)
      return
    }
    user.saveUserToDb(userJsonToUserObj(data), function(err) {
      if (err) {
        if (err.code == 'ER_DUP_ENTRY') {
          handleError(res, 409, 'DUPID', 'User ID already exists')
          return
        }
        throw err
      }

      res.sendStatus(200)
    })
  })
}

function checkin(req, res) {
  let data = req.body
  user.checkin(data, function(err) {
    if (err) {
      if (err.desc == 'NOID') {
        handleError(res, 400, 'NOID', "ID doesn't not exists")
        return
      }
      throw err
    }
    res.sendStatus(200)
  })
}

module.exports = { getUser, register, userJsonToUserObj, checkin }
