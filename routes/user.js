const router = require('express').Router()
const user = require('../controllers/users/pages')
const isAdmin = require('../middleware/isAdmin')
const isLoggedIn = require('../middleware/isLoggedIn')
const isUser = require('../middleware/isUser')
router.get('/addUser', user.Adduser)
router.get('/login', user.Login)
router.get('/', isUser, user.Home)

module.exports = router