const express = require('express');
const router = express.Router();
const authController = require('./auth.controllers');

// Login route
router.get("/login",authController.renderLogin);
router.post('/login', authController.login);

// Register route
router.get("/register", authController.renderRegister);
router.post('/register', authController.register);

//Logout route
router.get("/logout", authController.logout);

// Route to check availability of username and email
router.post("/check-availability", authController.checkAvailability);

module.exports = router;