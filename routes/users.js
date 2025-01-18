// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const catchAsync = require('../utils/catchAsync');
// const User = require('../models/user');
// const users = require('../controllers/users');

// router.route('/register')
//     .get(users.renderRegister)
//     .post(catchAsync(users.register));

// router.route('/login')
//     .get(users.renderLogin)
//     .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

// router.get('/logout', users.logout)

// module.exports = router;

//gpt code:


const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        users.login
    );

router.get('/logout', users.logout);

router.route('/profile')
    .get(isLoggedIn, catchAsync(users.renderProfile))
    .put(isLoggedIn, catchAsync(users.updateUsername))
    .delete(isLoggedIn, catchAsync(users.deleteAccount));

module.exports = router;


