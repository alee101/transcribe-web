/* API Routes */

var fs = require('fs');
var path = require('path');
var tesseract = require('node-tesseract');
var User = require('./models/user');
var isLoggedIn = require('./middleware').isLoggedIn;

module.exports = function(app) {

	// Authenticate phone users
	app.post('/api/auth', function (req, res, next) {
		console.log('Received phone authentication request');
		console.log(req.body);
		User.findOne({ 'email' : req.body.email }, function (err, user) {
			if (err) {
				err.status = 401;
				return next(err);
			} 

			if (!user || !user.validPassword(req.body.password)) {
				var err = new Error('Invalid login');
				err.status = 401;
				return next(err);
			}

			console.log(user.id);
			res.send(200, user.id);
		});
	});

	// Add new note extracting text from image
	app.post('/api/image', function (req, res, next) {
		console.log('Received image from ' + req.body.token);
		User.findById(req.body.token, function (err, user) {
			if (err) {
				err.status = 401;
				return next(err);
			} 

			if (!user || user.email !== req.body.email) {
				var err = new Error('User with token ' + req.body.token + ' could not be validated');
				err.status = 401;
				return next(err);
			}

			var img = __dirname + '/test.jpg';
			// var img = __dirname + '/' + new Date().toISOString() + '.jpg';
			fs.writeFile(img, new Buffer(req.body.image, 'base64'), function (err) {
				if (err) return next(err);

				tesseract.process(img, function(err, text) {
					if (err) return next(err);

					console.log(text);
					// Hack for making sure user hasn't been modified since start of OCR
					User.findById(req.body.token, function (err, user) {
						if (err || !user) return next(err);
						user.notes.unshift({ text: text });
						user.save(function (err) {
							if (err) return next(err);								
							console.log('Saved note');
						});
					});
				});
			});

			res.send(200);				
		});
	});

	// Refresh notes
	app.get('/api/notes', isLoggedIn, function (req, res, next) {
		User.findById(req.user.id, function (err, user) {
			if (err) return next(err);

			res.json(user.notes);
		});
	});


	// Save new note
	app.post('/api/note', isLoggedIn, function (req, res, next) {
		User.findById(req.user.id, function (err, user) {
			if (err) return next(err);

			user.notes.unshift({ text: req.body.text });
			user.save(function (err) {
				if (err) return next(err);
				console.log('Saved new note');
				res.send(200, { note: user.notes[0] });
			});
		});		
	})

	// Save note edit
	app.put('/api/note', isLoggedIn, function (req, res, next) {
		console.log(req.body);
		User.findById(req.user.id, function (err, user) {
			if (err) return next(err);

			var note = user.notes.id(req.body._id);

			if (!note) 
				return next(new Error('Cannot find note to save'));

			note.text = req.body.text;
			note.lastEdited = new Date();
			user.save(function (err) {
				if (err) return next(err);

				console.log('Saved note');
				res.send(200);
			});
		});
	});

	// Make note shared
	app.put('/api/note/share', isLoggedIn, function (req, res, next) {
		console.log(req.body);
		User.findById(req.user.id, function (err, user) {
			if (err) return next(err);

			var note = user.notes.id(req.body._id);
			note.shareUrl = user._id + '=' + req.body._id;
			user.save(function (err) {
				if (err) return next(err);

				console.log('Note public');
				res.send(200, { path: note.shareUrl });
			});
		});
	});

	// Delete note
	app.delete('/api/note/delete/:id', isLoggedIn, function (req, res, next) {
		console.log(req.body);
		User.findById(req.user.id, function (err, user) {
			if (err) return next(err); 

			if (!user.notes.id(req.params.id)) 
				return next(new Error('Cannot find note to delete'));

			var note = user.notes.id(req.params.id).remove();
			user.save(function (err) {
				if (err) return next(err);

				console.log('Deleted note');
				res.send(200);
			});
		});
	});

	// Save tags
	app.put('/api/note/tags', isLoggedIn, function (req, res, next) {
		console.log(req.body);
		User.findById(req.user.id, function (err, user) {
			if (err) return next(err);

			var note = user.notes.id(req.body._id);
			note.tags = req.body.tags;
			note.lastEdited = new Date();
			user.save(function (err) {
				if (err) return next(err);

				console.log('Saved note');
				res.send(200);
			});
		});
	});
};
