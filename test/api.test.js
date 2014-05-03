var should = require('should');
var request = require('supertest');
var app = require('../server');

var User = require('../app/models/user');

describe('Authorization test', function () {

	before(function (done) {
		request(app)
		.post('/signup')
		.send({ email: 'apitest@test.com', password: 'password' })
		.end(function (err, res) {
			should.not.exist(err);
			done();
		});
	});

	it('should return correct token when using valid login', function (done) {
		request(app)
		.post('/api/auth')
		.send({ email: 'apitest@test.com', password: 'password' })
		.end(function (err, res) {
			should.not.exist(err);
			res.status.should.equal(200);
			User.findOne({ email: 'apitest@test.com' }, function (err, user) {
				should.not.exist(err);
				user._id.toHexString().should.equal(res.text);
				done();
			});
		});
	});

	it('should return 401 unauthorized when using invalid login email', function (done) {
		request(app)
		.post('/api/auth')
		.send({ email: 'apitester@test.com', password: 'password' })
		.end(function (err, res) {
			res.status.should.equal(401);
			done();
		});
	});

	it('should return 401 unauthorized when using invalid login password', function (done) {
		request(app)
		.post('/api/auth')
		.send({ email: 'apitest@test.com', password: 'pass' })
		.end(function (err, res) {
			res.status.should.equal(401);
			done();
		});
	});

	after(function (done) {
		User.findOneAndRemove({ email: 'apitest@test.com' }, function (err, user) {
			should.not.exist(err);
			console.log('Removed user');
			console.log(user);
			done();
		});
	});
});


// describe('Image OCR test', function () {

// 	before(function (done) {
// 		request(app)
// 		.post('/signup')
// 		.send({ email: 'apitest@test.com', password: 'password' })
// 		.end(function (err, res) {
// 			should.not.exist(err);
// 			done();
// 		});
// 	});

// 	after(function (done) {
// 		User.findOneAndRemove({ email: 'apitest@test.com' }, function (err, user) {
// 			should.not.exist(err);
// 			console.log('Removed user');
// 			console.log(user);
// 			done();
// 		});
// 	});
// });
