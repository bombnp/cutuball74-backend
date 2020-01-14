//Load environment variable from dot env files
require('dotenv').config()


//Load config from config.js
config = require('./config.js')


//Connect to mysql
//From https://cloud.google.com/sql/docs/mysql/connect-app-engine?hl=th
mysql = require('mysql')

let pool;
const createPool = async () => {
  pool = await mysql.createPool(config.dbConfig);
};
createPool();


// Setup express
const express = require('express');
const app = express();


//Routing
app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});


// Start server
// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
