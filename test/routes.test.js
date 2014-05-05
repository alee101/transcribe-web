var should = require('should');
var request = require('supertest');
// var agent = request.agent();
var app = require('../server');

var User = require('../app/models/user');

describe('Sign up test', function () {
	var user;
	
	before(function (done) {
		user = new User({
			uname: 'test',
			password: 'password'
		});
		user.save(done);
	});

	it('should have sign up page', function (done) {
		request(app)
		.get('/signup')
		.expect(200)
		.end(done);
	});

	it('should not allow for duplicate accounts', function (done) {
		request(app)
		.post('/signup')
		.send({ uname: 'test', password: 'password' })
		.end(function (err, res) {
			res.headers['location'].should.include('/signup');
			// app.didFlash('signupMessage').should.be(true);
			done();
		});
	});

	it('should require username', function (done) {
		request(app)
		.post('/signup')
		.send({ uname: '', password: 'password' })
		.end(function (err, res) {
			res.headers['location'].should.include('/signup');
			done();
		});
	});

	it('should require password', function (done) {
		request(app)
		.post('/signup')
		.send({ uname: 'test2', password: '' })
		.end(function (err, res) {
			res.headers['location'].should.include('/signup');
			done();
		});
	});

	it('should not allow for invalid length username (too short)', function (done) {
		request(app)
		.post('/signup')
		.send({ uname: 'aa', password: 'password' })
		.end(function (err, res) {
			res.headers['location'].should.include('/signup');
			done();
		});
	});

	it('should not allow for invalid length username (too long)', function (done) {
		request(app)
		.post('/signup')
		.send({ uname: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', password: 'password' })
		.end(function (err, res) {
			res.headers['location'].should.include('/signup');
			done();
		});
	});

	it('should not allow for invalid length passwords (too short)', function (done) {
		request(app)
		.post('/signup')
		.send({ uname: 'test2', password: 'test' })
		.end(function (err, res) {
			res.headers['location'].should.include('/signup');
			done();
		});
	});

	it('should not allow for invalid length passwords (too long)', function (done) {
		request(app)
		.post('/signup')
		.send({ uname: 'test2', password: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
		.end(function (err, res) {
			res.headers['location'].should.include('/signup');
			done();
		});
	});

	it('should redirect to /notes when signed in', function (done) {
		request(app)
		.post('/signup')
		.send({ uname: 'test2', password: 'password' })
		.end(function (err, res) {
			should.not.exist(err);
			res.headers['location'].should.include('/notes');
			done();
		});
	});

	after(function (done) {
		user.remove();
		User.findOneAndRemove({ uname: 'test2' }, function (err, user) {
			should.not.exist(err);
			console.log('Removed user');
			console.log(user);
			done();
		});
	});
});


describe('Login test', function () {

	before(function (done) {
		request(app)
		.post('/signup')
		.send({ uname: 'logintest', password: 'password' })
		.end(function (err, res) {
			should.not.exist(err);
			done();
		});
	});

	it('should have login page', function (done) {
		request(app)
		.get('/login')
		.expect(200)
		.end(done);
	});

	it('should redirect to /login when not logged in', function (done) {
		request(app)
		.get('/notes')
		.expect('Location', '/login')
		.end(done);
	});

	it('should require username', function (done) {
		request(app)
		.post('/login')
		.send({ uname: '', password: 'password' })
		.end(function (err, res) {
			res.headers['location'].should.include('/login');
			done();
		});
	});

	it('should require password', function (done) {
		request(app)
		.post('/login')
		.send({ uname: 'logintest', password: '' })
		.end(function (err, res) {
			res.headers['location'].should.include('/login');
			done();
		});
	});

	it('should not allow for invalid length username (too short)', function (done) {
		request(app)
		.post('/login')
		.send({ uname: 'aa', password: 'password' })
		.end(function (err, res) {
			res.headers['location'].should.include('/login');
			done();
		});
	});

	it('should not allow for invalid length username (too long)', function (done) {
		request(app)
		.post('/login')
		.send({ uname: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', password: 'password' })
		.end(function (err, res) {
			res.headers['location'].should.include('/login');
			done();
		});
	});

	it('should not allow for invalid length passwords (too short)', function (done) {
		request(app)
		.post('/login')
		.send({ uname: 'logintest', password: 'test' })
		.end(function (err, res) {
			res.headers['location'].should.include('/login');
			done();
		});
	});

	it('should not allow for invalid length passwords (too long)', function (done) {
		request(app)
		.post('/signup')
		.send({ uname: 'logintest', password: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
		.end(function (err, res) {
			res.headers['location'].should.include('/signup');
			done();
		});
	});

	it('should redirect to /notes when logged in', function (done) {
		request(app)
		.post('/login')
		.send({ uname: 'logintest', password: 'password' })
		.end(function (err, res) {
			should.not.exist(err);
			res.headers['location'].should.include('/notes');
			done();
		});
	});

	after(function (done) {
		User.findOneAndRemove({ uname: 'logintest' }, function (err, user) {
			should.not.exist(err);
			console.log('Removed user');
			console.log(user);
			done();
		});
	});
});
