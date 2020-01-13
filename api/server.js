//Load environment variable from dot env files
require('dotenv').config()

//Connect to mysql
//From https://cloud.google.com/sql/docs/mysql/connect-app-engine?hl=th

mysql = require('mysql')

let pool;
const createPool = async () => {
  pool = await mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
  });

  //Testing CLOUD_SQL_CONNECTION_NAME

  pool.getConnection(function (err, conection) {
    if (err) throw err;
    console.log("DB connectted")
  })
};
createPool();



const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
