var User = require('./models/user');
var ShortUrl = require('./models/shorturl');
var isLoggedIn = require('./middleware').isLoggedIn;

module.exports = function(app, passport) {

	app.get('/', isLoggedIn, function (req, res) {
		res.render('index.ejs', { user: req.user });
	});

	app.get('/login', isLoggedIn, function (req, res) {
		res.render('login.ejs', { 
			message: req.flash('loginMessage'), 
			user: req.user 
		});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/notes',
		failureRedirect : '/login',
		failureFlash : true
	}));

	app.get('/signup', isLoggedIn, function (req, res) {
		res.render('signup.ejs', { 
			message: req.flash('signupMessage'), 
			user: req.user 
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/notes',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	app.get('/notes', isLoggedIn, function (req, res) {
		res.render('notes.ejs', {
			user : req.user
		});
	});

	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/note/:id', function (req, res, next) {
		ShortUrl.findOne({ 'shortUrl': req.params.id }, function (err, shorturl) {
			if (err) {
				err.status = 404;
				return next(err);
			}

			User.findById(shorturl.userId, function (err, user) {
				if (err) {
					err.status = 404;
					return next(err);
				}

				var note = user.notes.id(shorturl.noteId);
				if (!note || !note.shareUrl) {
					res.send('Note not shared');
				} else {
					res.send(note.text);
				}
			});
		});
	});

	// Handle non-existent routes
	app.get('*', function(req, res){
		res.send("Oops, looks like this page doesn't exist" , 404);
	});
};
