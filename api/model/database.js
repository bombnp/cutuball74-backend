const mysql = require('promise-mysql');
const config = require('../config.js');


let pool;

mysql.createPool(config.dbConfig[process.env.DB_CONNECTION]).then(
  (res) => {
    pool = res;
  }
)


module.exports = {
  "getPool" : () => pool
}
