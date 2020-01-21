const fieldvalidator = require('validator');
const jsonvalidator = require('jsonschema').validate;

/** Check if string is valid Thai ID
  *
  * @param {String} s
  */
function validateThaiID(s) {
  let x = 0;
  for (let i = 0; i < 12; i++) {
    x += parseInt(s[i]) * (13-i);
  }
  x %= 11;
  return x <= 1 ? (parseInt(s[12]) == 1-x) : (parseInt(s[12]) == 11 - x);
}


/** Check if data object conform with user data API JSON
  *
  * @param {Object} data
  * @param {Function} callback receiving error message or null if no error
  */
function validateUserJson(data, callback) {
  //Test definition
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

  // strip dashes
  data.tel = data.tel.replace("-","");

  //Must return exaxtly true if succeed
  let validators = [ (data) => data ? true: "No data",
   (data) => jsonvalidator(data, schema).valid || "Invalid json schema",
   (data) => data.ID.length == 13 || "Invalid id length",
   (data) => fieldvalidator.isNumeric(data.ID) || "Non numeric ID",
   (data) => validateThaiID(data.ID) || "Invalid ID checksum",
   (data) => fieldvalidator.isMobilePhone(data.tel, 'th-TH') || "Invalid mobile phone",
   (data) => fieldvalidator.isEmail(data.email) || "Invalid Email"
  ];

  let validationErrors = [];

  validators.forEach((validator) => {
    let res = validator(data);
    if(res != true) {
      validationErrors.push(res);
    }
  })

  if(validationErrors)
    callback(validationErrors.join(", "));
  else
    callback(null);
}



module.exports = { validateUserJson }
