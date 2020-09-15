const Campground = require('../models/campground');
const Comment = require('../models/comment');

// all the middleware goes here
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	// is user logged in
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if (err) {
				req.flash('error', 'Campground not found');
				res.redirect('back');
			} else {
				if (!foundCampground) {
					req.flash('error', 'Item not found.');
					return res.redirect('back');
				}
				// does user own this campground?
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'Permission Denied');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to be logged in to do that.');
		res.redirect('back');
	}
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
	// is user logged in
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				req.flash('error', 'Something went wrong...');
				res.redirect('back');
			} else {
				if (!foundCampground) {
					req.flash('error', 'Item not found.');
					return res.redirect('back');
				}
				// does user own this comment?
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'Permission Denied');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to be logged in to do that');
		res.redirect('back');
	}
};

middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'Please login.');
	res.redirect('/login');
};

module.exports = middlewareObj;
