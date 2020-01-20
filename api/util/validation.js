const fieldvalidator = require('validator');
const jsonvalidator = require('jsonschema').validate;

/** Check if string is valid Thai ID
  *
  * @param {String} s
  */
function validthaiid(s) {
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
function validateuserjson(data, callback) {
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

  //Must return exaxtly true if succeed
  let check = [ (data) => data ? true: "No data",
   (data) => jsonvalidator(data, schema).valid || "Invalid json schema",
   (data) => data.ID.length == 13 || "Invalid id length",
   (data) => fieldvalidator.isNumeric(data.ID) || "Non numeric ID",
   (data) => validthaiid(data.ID) || "Invalid ID checksum",
   (data) => fieldvalidator.isMobilePhone(data.tel, 'th-TH') || "Invalid mobile phone",
   (data) => fieldvalidator.isEmail(data.email) || "Invalid Email"
 ];


 //Testing
 for (let i = 0; i < check.length; i++) {
   let res = check[i](data);
   if (res != true) {
    callback(res);
    return;
   }
 }

 callback(null);
}

module.exports = {validateuserjson}
