var fs = require('fs');
var path = require('path');
var tesseract = require('node-tesseract');

module.exports = function(app, passport) {

	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
	}));

	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.post('/image', function (req, res) {
		var img = __dirname + '/test.jpg';
		// var img = __dirname + '/' + new Date().toISOString() + '.jpg';
		fs.writeFile(img, new Buffer(req.body.image, 'base64'), function (err) {
			if (err) console.log(err);
			else {
				tesseract.process(img, function(err, text) {
					if(err) console.log(err);
					else {
						console.log(text);
					}
				});
			}
		});
		res.send(200);
	});
};

// route middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
}
