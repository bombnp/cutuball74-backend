const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');

const auth = require('./auth.js');
const dummy = require('./dummy.js')


const router = express.Router();


// CONFIG Enable CORS for all route
router.use(cors());
router.options('*', cors());
//TODO more strict cors options.


// ROUTE / Welcome page
router.get('/', (req, res) => {
  res.send("CUTUBall API Service");
})


//ROUT /ping ping
router.get('/ping',
  dummy.ping
)


// ROUTE /token Token Exchange
authServ = auth.authServer;
router.post('/token',
  bodyParser.urlencoded({ extended: false }),
  authServ.token(),
  authServ.errorHandler()
);
passport.use(auth.jwtStrategy);


// ROUTE /test/protected Example Protected Endpoint
router.get('/test/protected',
   passport.authenticate('jwt', {session:false}),
   dummy.testprotect
 );


module.exports = router;
