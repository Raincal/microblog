(function(jq) {

	var $alertContainer = jq("#alertContainer");

	if ($alertContainer.length > 0) {

		var msgCount = 0;
		var $div = jq("#alertContainer div");
		var userTweetsArray = [];

		var handler = function(e) {

			e.preventDefault();

			$alertContainer.hide("normal");

			var html = "";
			var post = null;

			for (var i = userTweetsArray.length; i > 0; i--) {

				post = userTweetsArray[i - 1];

				html += '<div class="row">';
				html += '<div class="span6 offset3 comment">';
				html += '<h2><a href="/u/' + post.user + '">' + post.user + '</a> 说</h2>';
				html += '<p><small>' + post.time + '</small></p>';
				html += '<p>' + post.post + '</p>';
				html += '</div></div>';

			}

			userTweetsArray.length = 0;

			$alertContainer.after(html);
		}

		$div.one("click", handler);

		var socket = io.connect('http://localhost');

		socket.on('messages', function(tweetsArray) {

			jq.merge(userTweetsArray, tweetsArray);

			if (userTweetsArray && userTweetsArray.length > 0) {

				$div.text("有 " + userTweetsArray.length + " 条新微薄，请点击查看。");
				$alertContainer.show("fast");
				$div.one("click", handler);

			}

		});

		jq("#postTweet").click(function(e) {

			e.preventDefault();

			var tweet = jq("input[name='post']").val();

			if (tweet === "") {

				var html = '<div class="alert alert-error">请 输 入 内 容</div>';
				jq("#alertDiv").hide().empty().append(html).show("normal").delay(3000).hide("normal");
				return false;
			}

			var post = {
				user: jq('#postuser').val(),
				post: tweet
			};

			jq.post("/post", post, function(msg) {

				jq("#post").val("");
				html = '<div class="alert alert-success">' + msg + '</div>';
				jq("#alertDiv").hide().empty().append(html).show("normal").delay(3000).hide("normal");

				socket.emit('messages', post);

			});

		});
	}

})(jQuery);