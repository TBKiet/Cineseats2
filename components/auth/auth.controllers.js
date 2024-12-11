const {registerHandler} = require('./auth.service');
const passport = require("passport");
const User = require("./auth.models");
const renderLogin = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    res.render("login", {layout: "main"});
};
// Login controller
const login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })(req, res, next);
};


const renderRegister = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    res.render("register", {layout: "main"});
}
const register = (req, res) => {
    let {username, email, password, re_password} = req.body;
    username = username.trim();
    email = email.trim();
    password = password.trim();
    re_password = re_password.trim();
    registerHandler(username, email, password, re_password, res);
};
const logout = (req, res, next) => { // Include next as a parameter
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/");
        });
    });
};

async function checkAvailability(req, res) {
    const {field, value} = req.body;

    if (!field || !value) {
        return res.status(400).json({available: false, message: 'Invalid input'});
    }

    try {
        // Dynamically check the field (username or email)
        const query = {};
        query[field] = value;

        const existingUser = await User.findOne(query);

        if (existingUser) {
            return res.json({available: false, message: `${field} is already taken`});
        }

        res.json({available: true, message: `${field} is available`});
    } catch (err) {
        console.error(err);
        res.status(500).json({available: false, message: 'Server error'});
    }
}

module.exports = {login, register, renderLogin, renderRegister, logout, checkAvailability};