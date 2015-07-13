var settings = require('../settings');
// mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + settings.host + '/' + settings.db, {
	server: {
		poolSize: 10
	}
});

var conn = mongoose.connection;

conn.on('connecting', function() {
	console.log("connecting");
});
conn.on('connected', function() {
	console.log("connected");
});
conn.on('open', function() {
	console.log("open");
});
conn.on('disconnecting', function() {
	console.log("disconnecting");
});
conn.on('disconnected', function() {
	console.log("disconnected");
});
conn.on('close', function() {
	console.log("close");
});
conn.on('reconnected', function() {
	console.log("reconnected");
});
conn.on('error', function() {
	console.log("error");
});
conn.on('fullsetup', function() {
	console.log("fullsetup");
});

exports.disconnect = function() {
	mongoose.disconnect(function(err){
		console.log('all connection closed.');
	});
};