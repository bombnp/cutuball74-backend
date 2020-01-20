const fieldvalidator = require('validator');
const jsonvalidator = require('jsonschema').validate;
const user = require('../model/user.js');


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


function validthaiid(s) {
  let x = 0;
  for (let i = 0; i < 12; i++) {
    x += parseInt(s[i]) * (13-i);
  }
  x %= 11;
  return x <= 1 ? (parseInt(s[12]) == 1-x) : (parseInt(s[12]) == 11 - x);
}


function register(req, res) {
  const schema = {
    "type": "object",
    "properties" : {
      "ID" : {"type":"string"},
      "name" : {"type": "string"},
      "email" : {"type": "string"},
      "faculty" : {"type": "string"},
      "tel" : {"type": "string"}
    },
    "required": ["ID", "name", "email", "faculty", "tel"]
  };

  let data = req.body;

  let check = [ (data) => data ? true: "No data",
   (data) => jsonvalidator(data, schema).valid || "Invalid json schema",
   (data) => data.ID.length == 13 || "Invalid id length",
   (data) => fieldvalidator.isNumeric(data.ID) || "Non numeric ID",
   (data) => validthaiid(data.ID) || "Invalid ID checksum",
   (data) => true, // TODO Maybe check faculty
   (data) => fieldvalidator.isMobilePhone(data.tel, 'th-TH') || "Invalid mobile phone",
   (data) => fieldvalidator.isEmail(data.email) || "Invalid Email"
 ];

 let valid;
 valid = true;
 let verror;
 for (let i = 0; i < check.length; i++) {
   let res = check[i](data);
   if (res != true) {
    verror = res;
    valid = false;
    break;
  }
 }

  if (valid) {
    let userdata = {
      id: data.ID,
      name: data.name,
      email: data.email,
      faculty: data.faculty,
      tel: data.tel
    };
    user.saveUserToDb(userdata, function (err) {
      if (err.code ==  'ER_DUP_ENTRY') {
        res.status(409).json({"error" : "DUP", "error_description" : "User with specified id already registered."});
        return;
      }

      if (err) {
        res.status(500);
        console.log("Error while saving user to DB");
        console.log(err);
        return;
      }

      res.sendStatus(200);
    })
  } else {
    res.status(400).json({"error" : "INSANE", "error_description" : "Validation failed: " + verror});
  }

}

module.exports = {getuser, register};
