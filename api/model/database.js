const mysql = require('promise-mysql');
const config = require('../config.js');


let pool;

mysql.createPool(config.dbConfig).then(
  (res) => {
    pool = res;
  }
)


module.exports = {
  "getPool" : () => pool
}
