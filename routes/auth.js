const router = require('express').Router()
const user = require('../controllers/users/auth')
const User = require('../models/user')
const { check} = require('express-validator');
const { isEmpty } = require('validator');

router.post('/addUser', [
    check('name').notEmpty().withMessage('Your name is required'),
    check('email').notEmpty().withMessage('Your email is required, ').normalizeEmail().isEmail(),
    check('password').notEmpty().withMessage('Password is required, ').isLength({ min: 6 }).withMessage('Your password lenth must greater than 6 characters')
], user.AuthRegister);

router.post('/login', [
    check('email').notEmpty().withMessage('Your email is required '), check('password').notEmpty().withMessage('Password is required ')
] , user.Login)

module.exports = router