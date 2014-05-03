var should = require('should');
var request = require('supertest');
// var agent = request.agent();
var app = require('../server');

var User = require('../app/models/user');

describe('Sign up test', function () {
	var user;
	
	before(function (done) {
		user = new User({
			email: 'test@test.com',
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
		.send({ email: 'test@test.com', password: 'password' })
		.end(function (err, res) {
			res.headers['location'].should.include('/signup');
			// app.didFlash('signupMessage').should.be(true);
			done();
		});
	});

	it('should require email', function (done) {
		request(app)
		.post('/signup')
		.send({ email: '', password: 'password' })
		.end(function (err, res) {
			res.headers['location'].should.include('/signup');
			done();
		});
	});

	it('should require password', function (done) {
		request(app)
		.post('/signup')
		.send({ email: 'test2@test.com', password: '' })
		.end(function (err, res) {
			res.headers['location'].should.include('/signup');
			done();
		});
	});

	it('should not allow for invalid length email (too long)', function (done) {
		request(app)
		.post('/signup')
		.send({ email: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@test.com', password: 'password' })
		.end(function (err, res) {
			res.headers['location'].should.include('/signup');
			done();
		});
	});

	it('should not allow for invalid length passwords (too short)', function (done) {
		request(app)
		.post('/signup')
		.send({ email: 'test2@test.com', password: 'test' })
		.end(function (err, res) {
			res.headers['location'].should.include('/signup');
			done();
		});
	});

	it('should not allow for invalid length passwords (too long)', function (done) {
		request(app)
		.post('/signup')
		.send({ email: 'test2@test.com', password: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
		.end(function (err, res) {
			res.headers['location'].should.include('/signup');
			done();
		});
	});

	it('should redirect to /notes when signed in', function (done) {
		request(app)
		.post('/signup')
		.send({ email: 'test2@test.com', password: 'password' })
		.end(function (err, res) {
			should.not.exist(err);
			res.headers['location'].should.include('/notes');
			done();
		});
	});

	after(function (done) {
		user.remove();
		User.findOneAndRemove({ email: 'test2@test.com' }, function (err, user) {
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
		.send({ email: 'logintest@test.com', password: 'password' })
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

	it('should require email', function (done) {
		request(app)
		.post('/login')
		.send({ email: '', password: 'password' })
		.end(function (err, res) {
			res.headers['location'].should.include('/login');
			done();
		});
	});

	it('should require password', function (done) {
		request(app)
		.post('/login')
		.send({ email: 'logintest@test.com', password: '' })
		.end(function (err, res) {
			res.headers['location'].should.include('/login');
			done();
		});
	});

	it('should not allow for invalid length email (too long)', function (done) {
		request(app)
		.post('/login')
		.send({ email: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@test.com', password: 'password' })
		.end(function (err, res) {
			res.headers['location'].should.include('/login');
			done();
		});
	});

	it('should not allow for invalid length passwords (too short)', function (done) {
		request(app)
		.post('/login')
		.send({ email: 'logintest@test.com', password: 'test' })
		.end(function (err, res) {
			res.headers['location'].should.include('/login');
			done();
		});
	});

	it('should not allow for invalid length passwords (too long)', function (done) {
		request(app)
		.post('/signup')
		.send({ email: 'logintest@test.com', password: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
		.end(function (err, res) {
			res.headers['location'].should.include('/signup');
			done();
		});
	});

	it('should redirect to /notes when logged in', function (done) {
		request(app)
		.post('/login')
		.send({ email: 'logintest@test.com', password: 'password' })
		.end(function (err, res) {
			should.not.exist(err);
			res.headers['location'].should.include('/notes');
			done();
		});
	});

	after(function (done) {
		User.findOneAndRemove({ email: 'logintest@test.com' }, function (err, user) {
			should.not.exist(err);
			console.log('Removed user');
			console.log(user);
			done();
		});
	});
});
