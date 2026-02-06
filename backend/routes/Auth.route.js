const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/Auth.controller');
const Auth = require('../middleware/auth.middleware');
const { body } = require('express-validator');
router.post('/register', [
    body('firstname').isLength({min: 3}).withMessage('First name must be at least 3 characters long'),
    body('lastname').isLength({min: 3}).withMessage('Last name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], AuthController.register);
router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage("Password must be atleast 6 character long")
], AuthController.login);
router.get('/profile', Auth.authUser,  AuthController.getUserProfile);
router.get('/logout', Auth.authUser, AuthController.logout)

module.exports = router;