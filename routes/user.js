const router = require('express').Router()
const user = require('../controllers/users/pages')

router.get('/addUser', user.Adduser)
router.get('/login', user.Login)
router.get('/', user.Home)
router.post('/logout', user.Logout)

module.exports = router