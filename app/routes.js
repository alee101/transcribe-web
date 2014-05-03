var User = require('./models/user');
var isLoggedIn = require('./middleware').isLoggedIn;

module.exports = function(app, passport) {

	app.get('/', function (req, res) {
		res.render('index.ejs');
	});

	app.get('/login', function (req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/notes',
		failureRedirect : '/login',
		failureFlash : true
	}));

	app.get('/signup', function (req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
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

	app.get('/profile', isLoggedIn, function (req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/note/:id', function (req, res, next) {
		var ids = req.params.id.split('=');
		console.log(ids);
		User.findById(ids[0], function (err, user) {
			if (err) {
				err.status = 404;
				return next(err);
			}

			var note = user.notes.id(ids[1]);
			if (!note || !note.shareUrl) {
				res.send('Note not shared');
			} else {
				res.send(note.text);
			}
		});
	});
};
