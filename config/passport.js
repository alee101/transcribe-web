var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        if (!email || !password) {
            return done(null, false, req.flash('signupMessage', 'Email and password required'));
        }

        if (!validEmail(email)) {
            return done(null, false, req.flash('signupMessage', 'Email cannot exceed 64 characters'));
        }

        if (!validPassword(password)) {
            return done(null, false, req.flash('signupMessage', 'Password must be between 5 and 64 characters'));
        }

        User.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already being used.'));
            } else {
				// if there is no user with that email
                // create the user
                var newUser = new User();

                // set the user's local credentials
                newUser.email = email;
                newUser.password = newUser.generateHash(password);

                // create default note
                newUser.notes.push({ text: 'Welcome to TranScribe!' });
                
				// save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        if (!email || !password) {
            return done(null, false, req.flash('loginMessage', 'Email and password required'));
        }

        if (!validEmail(email)) {
            return done(null, false, req.flash('loginMessage', 'Invalid login'));
        }

        if (!validPassword(password)) {
            return done(null, false, req.flash('loginMessage', 'Invalid login'));
        }

        User.findOne({ 'email' :  email }, function(err, user) {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user with that username was found.'));

            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Invalid login'));

            // valid user, return the user
            return done(null, user);
        });
    }));
};

function validEmail(email) {
    return email.length <= 64;
}

function validPassword(password) {
    return ((password.length <= 64) && (password.length >= 5));
}