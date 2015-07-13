var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var post = new Schema({
	user: String,
	post: String,
	time: {
		type: Date,
		default: Date.now
	}
});

var Post = mongoose.model('Post', post);

module.exports = Post;