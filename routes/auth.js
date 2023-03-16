const router = require('express').Router()
const user = require('../controllers/auth/auth')
const User = require('../models/user')
const { check} = require('express-validator');
const { isEmpty } = require('validator');
const validateToken = require('../middleware/validateToken')
const resetPage = require('../middleware/reset')
router.post('/addUser', [
    check('name').notEmpty().withMessage('Your name is required'),
    check('email').notEmpty().withMessage('Your email is required, ').normalizeEmail().isEmail(),
    check('password').notEmpty().withMessage('Password is required, ').isLength({ min: 6 }).withMessage('Your password lenth must greater than 6 characters')
], user.AuthRegister);

router.post('/login', [
    check('email').notEmpty().withMessage('Your email is required '), check('password').notEmpty().withMessage('Password is required ')
] , user.Login)

router.post('/forgotPassword',  [
    check('email').notEmpty().withMessage('Your email is required ')],
     user.postForgotPassword)




     router.get('/retrive-password/:token', validateToken, user.passwordReset )

   
router.post('/changePassword', [
    check('password').notEmpty().withMessage('Password is required,').isLength({ min: 6 }).withMessage('Your password lenth must greater than 6 characters'),
    check('confirmPassword').notEmpty().withMessage('Confirm password must not be empty, ').custom((value, {req})=>{
        if(value !== req.body.password){
            throw new Error('The password does not match');
        }
        return true
    })
], user.retrivePassword )


router.get('/resetPassword', resetPage)


router.post('/resetPassword', [
    check('email').notEmpty().withMessage('Your email is required').custom((value, {req})=>{
        return User.findOne({
            where:{email:value}
        }).then(result=>{
            if(!result){
                throw new Error ('Invalid Email')
            }
        })
        
    }),    check('password').notEmpty().withMessage('Password is required ')
], user.reset)

router.get('/password', user.passwordpage)

router.post('/password', [
    check('password').notEmpty().withMessage('Password is required,').isLength({ min: 6 }).withMessage('Your password lenth must greater than 6 characters'),
    check('confirmPassword').notEmpty().withMessage('Confirm password must not be empty, ').custom((value, {req})=>{
        if(value !== req.body.password){
            throw new Error('The password does not match');
        }
        return true
    })
], user.password )
module.exports = router