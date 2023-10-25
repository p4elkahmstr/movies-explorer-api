const router = require('express').Router();
const { getMe, editUserData } = require('../controllers/users');
const { editUserValidator } = require('../validators/validators');

router.get('/users/me', getMe);

router.patch('/users/me', editUserValidator, editUserData);

module.exports = router;
