const express = require("express");
const router = express.Router();

const { errorHandler } = require ('../helpers/dbErrorHandler');
const { userSignupValidator } = require('../validator');
const { signup, signin, token, logout } = require('../controllers/auth');

router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.post('/token', token);
router.delete('/signout', logout);

module.exports = router;
