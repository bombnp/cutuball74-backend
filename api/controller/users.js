
const user = require('../model/user.js');
const validate = require('../util/validation.js');


function getuser(req, res) {
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


function userjsontouserobj(data) {
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

  error = (status, code, desc) => {
    res.status(status).json({"error" : code, "error_desccription":desc});
  }

  validate.validateuserjson(data, function (validationerr) {
    if (validationerr) {
      error(400, "VALIDATIONERR", validationerr)
      return;
    }
    user.saveUserToDb(userjsontouserobj(data), function (err) {
      if (err.code ==  'ER_DUP_ENTRY') {
        error(409, "DUPID", "User ID already exist");
        return;
      }
      if (err) {
        throw err;
      }
      res.sendStatus(200);
    });
  });
}

module.exports = {getuser, register};
