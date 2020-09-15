const express = require('express');
const router = express.Router();
let passport = require('passport');
const User = require('../models/user');

//Root route, landing.ejs page
router.get('/', (req, res) => {
	res.render('landing');
});

//register form route
router.get('/register', (req, res) => {
	res.render('register', { page: 'register' });
});

//handle sign up logic
router.post('/register', (req, res) => {
	let newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			req.flash('error', err.message);
			return res.redirect('register');
		}
		passport.authenticate('local')(req, res, () => {
			req.flash('success', 'Welcome to YelpCamp!');
			res.redirect('/campgrounds');
		});
	});
});

//show login form
router.get('/login', (req, res) => {
	res.render('login', { page: 'login' });
});

//handling login logic
//app.post("/login", middleware, callback)
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}),
	(req, res) => {}
);

//logout route
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Logged out successfully!');
	res.redirect('/campgrounds');
});

module.exports = router;
