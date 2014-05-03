var express  = require('express');
var app = express();
var port = process.env.PORT || 3100;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.configure(function() {
	app.use(express.logger('dev')); 
	app.use(express.cookieParser()); 
	app.use(express.json());
	app.use(express.urlencoded());

	app.set('view engine', 'ejs');
	app.set('views', __dirname + '/app/views');
	app.use(express.static(__dirname + '/public'));

	app.use(express.session({ secret: 'TODO:CHANGE-SECRET' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

	// Error handler
	app.use(function (err, req, res, next) {
		console.log(err.status || 500);
		console.log(err);
		res.send(err.status || 500);
	});
});

require('./app/routes.js')(app, passport);
require('./app/api.js')(app);

app.listen(port);
console.log('Listening on port ' + port);

module.exports = app;