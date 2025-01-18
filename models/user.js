// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const passportLocalMongoose = require('passport-local-mongoose');

// const UserSchema = new Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     }
// });

// UserSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model('User', UserSchema);

// new gpt code:
const mongoose = require('mongoose');
const Campground = require('./campground');
const Review = require('./review');

const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Middleware to delete associated campgrounds and reviews when a user is deleted
UserSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        // Delete all campgrounds authored by the user
        const campgrounds = await Campground.find({ author: doc._id });
        for (let campground of campgrounds) {
            await Campground.findByIdAndDelete(campground._id);
            await Review.deleteMany({ _id: { $in: campground.reviews } }); // Delete associated reviews
        }

        // Delete all reviews authored by the user
        await Review.deleteMany({ author: doc._id });
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
