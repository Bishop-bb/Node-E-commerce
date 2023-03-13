const router = require('express').Router()
const admin = require('../controllers/admin/pages')
router.get('/adminHome', admin.Adminhome)
router.get('/adminUserHome', admin.AdminUserHome)
router.get('/adminProductHome', admin.AdminProductHome)
router.get('/update/:id', admin.Update)
router.post('/updateUser', admin.Updateuser)
router.post('/deleteUser', admin.Delete)
router.post('/logout', admin.Logout)

module.exports = router