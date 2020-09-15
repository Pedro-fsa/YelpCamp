const express = require('express');
const router = express.Router();
const { route } = require('./comments');
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// INDEX - show all campgrounds
router.get('/', (req, res) => {
	// Get all campgrounds from DB
	Campground.find({}, function(err, allcampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', {
				campgrounds: allcampgrounds,
				currentUser: req.user,
				page: 'campgrounds'
			});
		}
	});
	// res.render("campgrounds", {campgrounds: campgrounds});
});

// CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
	// get data from form and add to campgrounds array
	let name = req.body.name;
	let price = req.body.price;
	let image = req.body.image;
	let desc = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	let newCampground = { name: name, price: price, image: image, description: desc, author: author };
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			// redirect back to campgrounds page
			res.redirect('/campgrounds');
		}
	});
});

// NEW - show form to create new campgrounds
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

// SHOW - shows more info about one campground
router.get('/:id', function(req, res) {
	// find the campground with provided id
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
		if (err) {
			console.log(err);
			req.flash('error', 'Something went wrong...');
		} else {
			if (!foundCampground) {
				req.flash('error', 'Item not found.');
				return res.redirect('back');
			}
			// render page with information about that campground
			res.render('campgrounds/show', { campground: foundCampground });
		}
	});
});

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err) {
			console.log(err);
			req.flash('error', 'Something went wrong...');
			res.redirect('back');
		} else {
			res.render('campgrounds/edit', { campground: foundCampground });
		}
	});
});

// UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	//find and update the correct campground
	let data = Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
	//redirect somewhere (show page)
});

// DESTROY ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, async (req, res) => {
	try {
		let foundCampground = await Campground.findById(req.params.id);
		await foundCampground.remove();
		res.redirect('/campgrounds');
	} catch (error) {
		console.log(error.message);
		res.redirect('/campgrounds');
	}
	// Campground.findByIdAndRemove(req.params.id, (err) => {
	//   if(err){
	//     res.redirect('/campgrounds/' + req.params.id);
	//   } else {
	//     res.redirect('/campgrounds');
	//   }
	// })
});

module.exports = router;
