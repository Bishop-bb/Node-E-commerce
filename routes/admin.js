const router = require('express').Router()
const admin = require('../controllers/admin/pages')
const isAdmin = require('../middleware/isAdmin')
const { check} = require('express-validator');

router.get('/adminHome',isAdmin, admin.Adminhome)
router.get('/adminUserHome', isAdmin, admin.AdminUserHome)
router.get('/adminProductHome', isAdmin, admin.AdminProductHome)
router.get('/update/:id', isAdmin, admin.Update)
router.post('/updateUser', isAdmin, admin.Updateuser)
router.post('/deleteUser', isAdmin, admin.Delete)
router.post('/logout', admin.Logout)
router.get('/forgotPassword', admin.forgotPasssword)
module.exports = router