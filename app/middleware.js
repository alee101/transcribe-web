module.exports = {
	isLoggedIn: function(req, res, next) {
		if (req.isAuthenticated()) {
			console.log(req.url);
			if (req.url === '/login' || req.url === '/signup')
				res.redirect('/notes')				
			else
				return next();				
		} else {
			if (req.url === '/notes')
				res.redirect('/login')
			else
				return next();
		}
	},
};