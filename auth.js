var crypto = require('crypto');

function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
};

function hashPassword(password, salt) {
    var hash = crypto.createHash('md5');
    var saltedPassword = password + salt;
    hash.update(saltedPassword);
    return hash.digest('hex');
};

function authUser(hashedPassAndSalt, password, salt) {
    var hash = crypto.createHash('md5');
    var saltedPassword = password + salt;
    hash.update(saltedPassword);
    return (hashedPassAndSalt === hash.digest('hex'));
};

function redirectToLogin(req, res, next) {
    if (!req.session.userID) {
        res.redirect('/login');
    } else {
        next();
    }
}

function redirectToHome(req, res, next) {
    if (req.session.userID) {
        res.redirect('/home');
    } else {
        next();
    }
}

function authUserGroup(req, res, next) {
    if (req.session.userID !== req.params.owner) {
        res.redirect('/home');
    } else {
        next();
    }
}


exports.generateSalt = generateSalt;
exports.hashPassword = hashPassword;
exports.authUser = authUser;
exports.redirectToLogin = redirectToLogin;
exports.redirectToHome = redirectToHome;
exports.authUserGroup = authUserGroup;