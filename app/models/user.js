var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
	name: String
});

var NoteSchema = new Schema({
	text: String,
	annotations: [String],
	// private: Boolean,
	tags: [TagSchema]
});

var FolderSchema = new Schema({
	title: String,
	notes: [NoteSchema]
});

var UserSchema = new Schema({
    email: String,
    password: String,
    folders: [FolderSchema]
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
