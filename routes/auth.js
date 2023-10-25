const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { signInValidator, signUpValidator } = require('../validators/validators');

router.post('/signin', signInValidator, login);

router.post('/signup', signUpValidator, createUser);

module.exports = router;