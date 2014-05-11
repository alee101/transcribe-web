var shortId = require('shortid');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShortUrlSchema = new Schema({
	shortUrl: {
		type: String,
		unique: true,
		default: function() { return shortId.generate(); }
	},
	userId: {
		type: String,
		required: true
	},
	noteId: {
		type: String,
		 required: true
	}
});

module.exports = mongoose.model('ShortUrl', ShortUrlSchema);
