//Load environment variable from dot env files
require('dotenv').config();


// Import
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const config = require('./config.js');
const user = require('./user.js');
const auth = require('./auth.js');


// Setup express
const app = express();


//Connect DB
dbPool = mysql.createPool(config.dbConfig);


//Welcome page
app.get('/', (req, res) => {
  res.send('Hello from CUTUBall API service!');
});


//Auth endpoint
authServ = auth.buildServer(dbPool);
app.post('/token',
  bodyParser.urlencoded({ extended: false }),
  authServ.token(),
  authServ.errorHandler()
);
passport.use(auth.buildJwtStrategy(dbPool));

// Example Protected Endpoint
app.get('/test/protected',
   passport.authenticate('jwt', {session:false}),
   function (req, res) {
     res.send("Protected Enpoint Reached.<br>Welcome " + req.user.firstname + "!");
   }
 );



// Start server
// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
