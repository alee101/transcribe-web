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

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
