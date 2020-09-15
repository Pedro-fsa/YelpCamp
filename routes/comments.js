const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

//Comments NEW
router.get('/new', middleware.isLoggedIn, (req, res) => {
	// find campground by id
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
});

//Comments CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
	//lookup campground using id
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					req.flash('error', 'Something went wrong...');
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash('success', 'Successfully added comment');
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
	//create new comment
	//connect new comment to campground
	//redirect to campground show page
});

// EDIT ROUTE FOR COMMENTS
// /campgrounds/:id/comments/:comment_id/edit
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundcomment) => {
		if (err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', { campground_id: req.params.id, comment: foundcomment });
		}
	});
});

// COMMENTS UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// COMMENTS DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, async (req, res) => {
	try {
		let foundComment = Comment.findById(req.params.comment_id);
		await foundComment.remove();
		req.flash('success', 'Comment deleted');
		res.redirect('/campgrounds/' + req.params.id);
	} catch (err) {
		console.log(err);
		req.flash('error', 'Something went wrong...');
		res.redirect('back');
	}
});

module.exports = router;
