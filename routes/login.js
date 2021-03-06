var express = require('express');
const router = express.Router();
const pool = require('../mysqlpool');
const auth = require('../auth');

//  Enum for login errors
const loginError = {
    INV_USERNAME: 'Username does not exist',
    INV_PASSWORD: 'Password is incorrect'
};

router.get('/', auth.redirectToHome, function (req, res, next) {
    res.render('login');
});

//  TODO: CHANGE THIS TO '/' ROUTE TO DISPLAY ERROR MESSAGE ON RENDER 
router.post('/auth', async function (req, res, next) {
    //  Parse request.
    let userData = {
        username: req.body.username,
        password: req.body.password
    };

    let errorMessage;

    const queryUsername = 'SELECT username, password, salt FROM Person WHERE username = ?';

    let rows = await pool.queryAsync(queryUsername, [userData.username]);

    if (rows === undefined || rows.length === 0) {
        //  If username is not found (account doesn't exist)
        console.log('Account doesn\'t exist');
        errorMessage = loginError.INV_USERNAME;
        res.redirect('/login');
    }

    //  Extract user credentials.
    let username = rows[0].username;
    let hashedPassAndSalt = rows[0].password;
    let salt = rows[0].salt;

    //  Check user credentials.
    if (auth.authUser(hashedPassAndSalt, userData.password, salt)) {

        //  User authenticated. Create session
        console.log('Password match! Logging in...');

        //  Maybe use uuid?
        req.session.userID = username;

        //  Save sessions when using redirect, 
        //  See https://github.com/expressjs/session#sessionsavecallback
        req.session.save((err) => {
            res.redirect('/home'); //   TODO CHANGE MAYBE?
        });

    } else {
        //  User not authenticated.
        console.log('Password does not match.');
        errorMessage = loginError.INV_PASSWORD;
        res.redirect('/login');
    }
    
});

module.exports = router;