var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
	text: String
});

var NoteSchema = new Schema({
	text: String,
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
    email: String,
    password: String,
    notes: [NoteSchema]
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
