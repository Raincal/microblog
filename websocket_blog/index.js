// socket.io

module.exports = function(server) {

    var allUsersMap = {};

    var io = require('socket.io').listen(server);

    io.sockets.on('connection', function(socket) {

        var connecterID = socket.id;
        console.log("\n当前connecter: " + connecterID);

        allUsersMap[connecterID] = socket;

        var tweetsArray = [];

        var getTweet = function(callback) {
            callback(tweetsArray);
        };

        var tweets = setInterval(function() {
            getTweet(function(tweetsArray) {
                if (tweetsArray.length > 0) {
                    var emiterID = socket.id;
                    console.log("\n当前emiterID: " + emiterID);
                    for (var key in allUsersMap) {
                        allUsersMap[key].volatile.emit('messages', tweetsArray);
                    }
                    tweetsArray.length = 0;
                }
            });
        }, 5000);

        socket.on('messages', function(post) {
            post.time = new Date();
            tweetsArray.push(post);
            console.log(post);
        });

        socket.on('disconnect', function() {
            clearInterval(tweets);
            delete allUsersMap[connecterID];
            console.log("\nconnecter：" + connecterID + " 离开微薄。");
        });

    });
};
