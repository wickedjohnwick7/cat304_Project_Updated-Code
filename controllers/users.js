// const User = require('../models/user');

// module.exports.renderRegister = (req, res) => {
//     res.render('users/register');
// }

// module.exports.register = async (req, res, next) => {
//     try {
//         const { email, username, password } = req.body;
//         const user = new User({ email, username });
//         const registeredUser = await User.register(user, password);
//         req.login(registeredUser, err => {
//             if (err) return next(err);
//             req.flash('success', 'Welcome to Yelp Camp!');
//             res.redirect('/campgrounds');
//         })
//     } catch (e) {
//         req.flash('error', e.message);
//         res.redirect('register');
//     }
// }

// module.exports.renderLogin = (req, res) => {
//     res.render('users/login');
// }

// module.exports.login = (req, res) => {
//     req.flash('success', 'welcome back!');
//     const redirectUrl = req.session.returnTo || '/campgrounds';
//     delete req.session.returnTo;
//     res.redirect(redirectUrl);
// }

// module.exports.logout = (req, res) => {
//     req.logout();
//     req.flash('success', "Goodbye!");
//     res.redirect('/campgrounds');
// }


//gpt code:

const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

// module.exports.register = async (req, res, next) => {
//     try {
//         const { email, username, password } = req.body;
//         const user = new User({ email, username });
//         const registeredUser = await User.register(user, password);
//         req.login(registeredUser, err => {
//             if (err) return next(err);
//             req.flash('success', 'Welcome to YelpCamp!');
//             res.redirect('/campgrounds');
//         });
//     } catch (e) {
//         req.flash('error', e.message);
//         res.redirect('register');
//     }
// };

//gpt

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp! Your account has been created.');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        if (e.code === 11000 && e.keyPattern.email) {
            req.flash(
                'error',
                'The email you entered is already associated with another account. Please use a different email or log in instead.'
            );
        } else if (e.name === 'UserExistsError') {
            req.flash(
                'error',
                'A user with this username already exists. Please choose a different username.'
            );
        } else {
            req.flash('error', e.message);
        }
        res.redirect('/register');
    }
};



module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
};

module.exports.renderProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.render('users/profile', { user });
};

// module.exports.updateUsername = async (req, res) => {
//     const { username } = req.body;
//     await User.findByIdAndUpdate(req.user._id, { username });
//     req.flash('success', 'Username updated successfully!');
//     res.redirect('/profile');
// };

//gpt:
module.exports.updateUsername = async (req, res) => {
    const { username } = req.body;
    await User.findByIdAndUpdate(req.user._id, { username });
    req.logout(); // Log out the user after username change
    req.flash(
        'success',
        'Your username has been updated successfully. Please log in again with your new username.'
    );
    res.redirect('/login'); // Redirect to login page
};


// module.exports.deleteAccount = async (req, res) => {
//     const userId = req.user._id;
//     await User.findByIdAndDelete(userId);
//     req.logout();
//     req.flash('success', 'Your account has been deleted along with associated data.');
//     res.redirect('/');
// };

// gpt:


module.exports.deleteAccount = async (req, res) => {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);
    req.logout(); // Logs the user out
    req.flash(
        'success',
        'Your account and all associated data have been successfully deleted. Register a new account!'
    );
    res.redirect('/register');
};
