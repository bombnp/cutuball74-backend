const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')

const auth = require('./auth.js')
const dummy = require('./dummy.js')
const users = require('./users.js')
const admin = require('./admin.js')
const error = require('./error.js')

const router = express.Router()

// CONFIG Enable CORS for all route
router.use(cors())
router.options('*', cors())
//TODO more strict cors options.

// ROUTE / Welcome page
router.get('/', (req, res) => {
  res.send('CUTUBall API Service')
})

//ROUT /ping ping
router.get('/ping', dummy.ping)

// ROUTE /token Token Exchange
authServ = auth.authServer
router.post('/token', bodyParser.urlencoded({ extended: false }), authServ.token(), authServ.errorHandler())
passport.use(auth.jwtStrategy)

// ROUTE /test/protected Example Protected Endpoint
router.get('/test/protected', passport.authenticate('jwt', { session: false }), dummy.testProtect)

//ROUTE /getuser
router.get('/getuser', passport.authenticate('jwt', { session: false }), users.getUser)

//ROUTE /register
router.post('/register', error.safeBodyParserJson, users.register)

router.get('/admin/ping', passport.authenticate('jwt', { session: false }), auth.checkAdminStatus, admin.ping)

router.put('/admin/edit', passport.authenticate('jwt', { session: false }), auth.checkAdminStatus, error.safeBodyParserJson, admin.editUser)

router.get('/admin/getusers', passport.authenticate('jwt', { session: false }), auth.checkAdminStatus, error.safeBodyParserJson, admin.getUsers)

router.get('/admin/query', passport.authenticate('jwt', { session: false }), auth.checkAdminStatus, error.safeBodyParserJson, admin.queryUser)

router.get('/admin/getstat', passport.authenticate('jwt', { session: false }), auth.checkAdminStatus, admin.getStat)

router.get('/admin/random', passport.authenticate('jwt', { session: false }), auth.checkAdminStatus, admin.randomizeUser)

router.get('/admin/randomhistory', passport.authenticate('jwt', { session: false }), auth.checkAdminStatus, admin.getRandomHistory)

router.delete('/admin/clearhistory', passport.authenticate('jwt', { session: false }), auth.checkAdminStatus, admin.clearRandomHistory)

module.exports = router
