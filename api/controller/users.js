
const user = require('../model/user.js');
const validate = require('../util/validation.js');


function getUser(req, res) {
  let user = req.user;
  let output = {
    "ID": user.id,
    "name": user.name,
    "email": user.email,
    "faculty": user.faculty,
    "tel": user.tel
  };
  res.json(output);
}


function userJsonToUserObj(data) {
  return {
    id: data.ID,
    name: data.name,
    email: data.email,
    faculty: data.faculty,
    tel: data.tel
  };
}


function register(req, res) {
  let data = req.body;

  handleError = (status, code, desc) => {
    res.status(status).json({"error" : code, "error_description":desc});
  }

  validate.validateUserJson(data, function (validationerr) {
    if (validationerr) {
      handleError(400, "VALIDATIONERR", validationerr)
      return;
    }
    user.saveUserToDb(userJsonToUserObj(data), function (err) {
      if (err) {
        if (err.code ==  'ER_DUP_ENTRY') {
          handleError(409, "DUPID", "User ID already exist");
          return;
        }
        throw err;
      }

      res.sendStatus(200);

    });
  });
}

module.exports = {getUser, register};
