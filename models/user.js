var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var user = new Schema({
	name: String,
	salt: String,
	hash: String
});

var User = mongoose.model('User', user);

module.exports = User;