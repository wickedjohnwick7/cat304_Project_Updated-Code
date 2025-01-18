// const { campgroundSchema, reviewSchema } = require('./schemas.js');
// const ExpressError = require('./utils/ExpressError');
// const Campground = require('./models/campground');
// const Review = require('./models/review');

// module.exports.isLoggedIn = (req, res, next) => {
//     if (!req.isAuthenticated()) {
//         req.session.returnTo = req.originalUrl
//         req.flash('error', 'You must be signed in first!');
//         return res.redirect('/login');
//     }
//     next();
// }



// module.exports.validateCampground = (req, res, next) => {
//     const { error } = campgroundSchema.validate(req.body);
//     console.log(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

// module.exports.isAuthor = async (req, res, next) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id);
//     if (!campground.author.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/campgrounds/${id}`);
//     }
//     next();
// }

// module.exports.isReviewAuthor = async (req, res, next) => {
//     const { id, reviewId } = req.params;
//     const review = await Review.findById(reviewId);
//     if (!review.author.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/campgrounds/${id}`);
//     }
//     next();
// }

// module.exports.validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }


// gpt code:

const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // Save URL to return after login
        req.flash('error', 'You must be logged in to access this feature.');

        return res.redirect('/login');
    }
    next();
};

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body); // Validate campground data
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400); // Throw error if validation fails
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id); // Fetch campground by ID
    if (!campground.author.equals(req.user._id)) { // Check if logged-in user is the author
        req.flash('error', 'You do not have permission to edit this campground.');

        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId); // Fetch review by ID
    if (!review.author.equals(req.user._id)) { // Check if logged-in user is the author of the review
        req.flash('error', 'You do not have permission to delete this review!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); // Validate review data
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400); // Throw error if validation fails
    } else {
        next();
    }
};

