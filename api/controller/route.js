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

// Enable Bodyparser Middleware for all routes
router.use(bodyParser.urlencoded({ extended: false }))
router.use(error.safeBodyParserJson)

// ROUTE / Welcome page
router.get('/', (req, res) => {
  res.send('CUTUBall API Service')
})

// ROUTE /token Token Exchange
authServ = auth.authServer
router.post('/token', authServ.token(), authServ.errorHandler())
passport.use(auth.jwtStrategy)

router.post('/register', error.safeBodyParserJson, users.register)

// All routes below will require jwt to access
router.use(passport.authenticate('jwt', { session: false }))

// Check admin permissions for all admin endpoints
router.use('/admin/*', auth.checkAdminStatus)

// Check staff permissions for all staff endpoints
router.use('/staff/*', auth.checkStaffStatus)

// -----------------------------------------------------

router.get('/getuser', users.getUser)

router.get('/getticket', users.getticket)

router.post('/staff/checkin', users.checkin)

router.get('/admin/ping', admin.ping)

router.put('/admin/edit', error.safeBodyParserJson, admin.editUser)

router.get('/admin/getusers', error.safeBodyParserJson, admin.getUsers)

router.get('/admin/query', error.safeBodyParserJson, admin.queryUser)

router.get('/admin/getstat', admin.getStat)

router.get('/admin/random', admin.randomizeUser)

router.get('/admin/randomhistory', admin.getRandomHistory)

router.delete('/admin/clearhistory', admin.clearRandomHistory)

router.delete('/admin/delete', admin.deleteUser)

module.exports = router
