var fs = require('fs');
var path = require('path');
var User = require('./models/user');
var tesseract = require('node-tesseract');

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

	app.get('/note/:id', function (req, res) {
		var ids = req.params.id.split('=');
		console.log(ids);
		User.findById(ids[0], function (err, user) {
			if (err) {
				console.log(err);
				res.send(404);
			} else {
				var note = user.notes.id(ids[1]);
				if (!note || !note.shared) {
					res.send('Note not shared');
				} else {
					res.send(note.text);
				}
			}
		});
	});


	// API Routes

	// Authenticate phone users
	app.post('/api/auth', function (req, res) {
		console.log('Received phone authentication request');
		console.log(req.body);
		User.findOne({ 'email' : req.body.email }, function (err, user) {
			if (err) {
				console.log(err);
				res.send(401);
			} else if (!user || !user.validPassword(req.body.password)) {
				console.log('Invalid login');
				res.send(401);
			} else {
				console.log(user.id);
				res.send(200, user.id);
			}
		});
	});

	// Add new note extracting text from image
	app.post('/api/image', function (req, res) {
		console.log('Received image');
		User.findById(req.body.token, function (err, user) {
			if (err) {
				console.log(err);
				res.send(401);
			} else if (!user || user.email !== req.body.email) {
				console.log(req.body.token);
				console.log('Could not validate user');
				res.send(401);
			} else {
				var img = __dirname + '/test.jpg';
				// var img = __dirname + '/' + new Date().toISOString() + '.jpg';
				fs.writeFile(img, new Buffer(req.body.image, 'base64'), function (err) {
					if (err) console.log(err);
					else {
						tesseract.process(img, function(err, text) {
							if(err) console.log(err);
							else {
								console.log(text);
								user.notes.unshift({ text: text });
								user.save(function (err) {
									if (err) console.log(err);
									else console.log('Saved note');
								});
							}
						});
					}
				});
				res.send(200);				
			}
		});
	});

	// Refresh notes
	app.get('/api/notes', isLoggedIn, function (req, res) {
		User.findById(req.user.id, function (err, user) {
			if (err) {
				console.log(err);
				res.send(404);
			} else {
				res.json(user.notes);
			}
		});
	});


	// Save new note
	app.post('/api/note', isLoggedIn, function (req, res) {
		User.findById(req.user.id, function (err, user) {
			if (err) {
				console.log(err);
				res.send(404);
			} else {
				user.notes.unshift({ text: req.body.text });
				user.save(function (err) {
					if (err) {
						console.log(err);
						res.send(404);
					}
					else {
						console.log('Saved new note');
						res.send(200, { note: user.notes[0] });
					}
				});
			}
		});		
	})

	// Save note edit
	app.put('/api/note', isLoggedIn, function (req, res) {
		console.log(req.body);
		User.findById(req.user.id, function (err, user) {
			if (err) {
				console.log(err);
				res.send(404);
			} else {
				var note = user.notes.id(req.body._id);
				note.text = req.body.text;
				note.lastEdited = new Date();
				user.save(function (err) {
					if (err) {
						console.log(err);
						res.send(404);
					}
					else {
						console.log('Saved note');
						res.send(200);
					}
				});
			}
		});
	});

	// Make note shared
	app.put('/api/note/share', isLoggedIn, function (req, res) {
		console.log(req.body);
		User.findById(req.user.id, function (err, user) {
			if (err) {
				console.log(err);
				res.send(404);
			} else {
				var note = user.notes.id(req.body._id);
				note.shared = true;
				user.save(function (err) {
					if (err) {
						console.log(err);
						res.send(404);
					}
					else {
						console.log('Note public');
						res.send(200, { path: user._id });
					}
				});
			}
		});
	});

	// Delete note
	app.delete('/api/note/delete/:id', isLoggedIn, function (req, res) {
		console.log(req.body);
		User.findById(req.user.id, function (err, user) {
			if (err) {
				console.log(err);
				res.send(404);
			} else {
				var note = user.notes.id(req.params.id).remove();
				user.save(function (err) {
					if (err) {
						console.log(err);
						res.send(404);
					}
					else {
						console.log('Deleted note');
						res.send(200);
					}
				});
			}
		});
	});

	// Save tags
	app.put('/api/note/tags', isLoggedIn, function (req, res) {
		console.log(req.body);
		User.findById(req.user.id, function (err, user) {
			if (err) {
				console.log(err);
				res.send(404);
			} else {
				var note = user.notes.id(req.body._id);
				note.tags = req.body.tags;
				note.lastEdited = new Date();
				user.save(function (err) {
					if (err) {
						console.log(err);
						res.send(404);
					}
					else {
						console.log('Saved note');
						res.send(200);
					}
				});
			}
		});
	});
};


// route middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
}
