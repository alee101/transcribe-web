var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
	text: {
		type: String,
		required: true
	}
});

var NoteSchema = new Schema({
	text: {
		type: String,
		required: true
	},
	annotations: [String],
	created: {
		type: Date,
		default: Date.now
	},
	lastEdited: {
		type: Date,
		default: Date.now
	},
	// private: Boolean,
	tags: [TagSchema]
});

var UserSchema = new Schema({
    email: {
		type: String,
		required: true
	},
    password: {
		type: String,
		required: true
	},
    notes: [NoteSchema]
});

UserSchema.path('email').validate(function (email) {
	return email.length <= 64;
}, 'Email cannot exceed 64 characters');

UserSchema.path('password').validate(function (password) {
	return ((password.length <= 64) && (password.length >= 5));
}, 'Invalid password length');

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
