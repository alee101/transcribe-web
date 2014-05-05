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
        usernameField : 'uname',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, uname, password, done) {
        if (!uname || !password) {
            return done(null, false, req.flash('signupMessage', 'Username and password required'));
        }

        if (!validUsername(uname)) {
            return done(null, false, req.flash('signupMessage', 'Username cannot exceed 64 characters'));
        }

        if (!validPassword(password)) {
            return done(null, false, req.flash('signupMessage', 'Password must be between 5 and 64 characters'));
        }

        User.findOne({ 'uname' :  uname }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that username
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That username is already being used.'));
            } else {
				// if there is no user with that username
                // create the user
                var newUser = new User();

                // set the user's local credentials
                newUser.uname = uname;
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
        usernameField : 'uname',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, uname, password, done) { // callback with uname and password from our form
        if (!uname || !password) {
            return done(null, false, req.flash('loginMessage', 'Username and password required'));
        }

        if (!validUsername(uname)) {
            return done(null, false, req.flash('loginMessage', 'Invalid login'));
        }

        if (!validPassword(password)) {
            return done(null, false, req.flash('loginMessage', 'Invalid login'));
        }

        User.findOne({ 'uname' :  uname }, function(err, user) {
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

function validUsername(uname) {
    return ((uname.length <= 64) && (uname.length >= 3));
}

function validPassword(password) {
    return ((password.length <= 64) && (password.length >= 5));
}