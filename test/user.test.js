var should = require('should');
// var mongoose = require('mongoose');
var User = require('../app/models/user');
// var configDB = require('../config/database.js');

// mongoose.connect(configDB.url);


describe('Users', function () {
	var user, dupuser;

	before(function (done) {
		user = new User({
			uname: 'test',
			password: 'password'
		});

		dupuser = new User(user);

		done();
	});

	describe('New User', function () {
		it('should not have test user', function (done) {
			User.find({ uname: 'test' }, function (err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should save new user', function (done) {
			user.save(done);
		});

		it('should fail to save identical new user', function (done) {
			user.save();
			return dupuser.save(function (err) {
				should.exist(err);
				done();
			});
		});

		it('should fail to save user without username', function (done) {
			user.uname = '';
			return user.save(function (err) {
				should.exist(err);
				err.errors.uname.message.should.include('required');
				done();
			});
		});

		it('should fail to save user with invalid length useruname (too short)', function (done) {
			user.uname = 'ab';
			return user.save(function (err) {
				should.exist(err);
				err.errors.uname.message.should.equal('Username must be between 3 and 64 characters');
				done();
			});
		});

		it('should fail to save user with invalid length useruname (too long)', function (done) {
			user.uname = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
			return user.save(function (err) {
				should.exist(err);
				err.errors.uname.message.should.equal('Username must be between 3 and 64 characters');
				done();
			});
		});

		it('should fail to save user without password', function (done) {
			user.uname = 'test';
			user.password = '';
			return user.save(function (err) {
				should.exist(err);
				err.errors.password.message.should.include('required');
				done();
			});
		});

		it('should fail to save user with invalid length password (too short)', function (done) {
			user.password = 'abcd';
			return user.save(function (err) {
				should.exist(err);
				err.errors.password.message.should.equal('Invalid password length');
				done();
			});
		});

		it('should fail to save user with invalid length password (too long)', function (done) {
			user.password = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
			return user.save(function (err) {
				user.password = 'password';
				should.exist(err);
				err.errors.password.message.should.include('Invalid password length');
				done();
			});
		});
	});

	describe('Notes', function () {
		it('should save new notes', function (done) {
			var notes = ['Test 1', 'Test 2', 'Test 3'];
			for (var i in notes) {
				user.notes.push({ text: notes[i] });
			}
			user.save(done);			
		});
	});

	describe('Tags', function () {
		it('should save tags', function (done) {
			var tags = ['Tag1', 'Tag2', 'Tag3'];
			for (var i in tags) {
				user.notes[0].tags.push({ text: tags[i] });
			}
			user.save(done);
		});
	});

	after(function (done) {
		user.remove();
		done();
	});
});
