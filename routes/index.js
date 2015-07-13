/*
 * GET home page.
 */

var hash = require('./auth').hash;
var User = require('../models/user.js');
var Post = require("../models/post.js");

module.exports = function(app) {

	var index = function(req, res) {
		Post.find({}).sort('-time').exec(function(err, posts) {
			if (err) posts = [];
			res.render('index', {
				title: '首页',
				posts: posts
			});
		});
	};

	var user = function(req, res) {
		User.findOne({
			name: req.params.user
		}, function(err, user) {
			if (!user) {
				req.session.error = "用户不存在";
				return res.redirect('/');
			}
			Post.find({
				user: user.name
			}).sort('-time').exec(function(err, posts) {
				if (err) {
					req.session.error = err;
					return res.redirect('/');
				}
				res.render('user', {
					title: user.name,
					posts: posts,
				});
			});
		});
	};

	var post = function(req, res) {
		var currentUser = req.session.user;
		var post = new Post();
		post.user = currentUser.name;
		post.post = req.body.post;
		post.save(function(err) {
			if (err) {
				req.session.error = err;
				return res.redirect('/');
			}
			res.send("发 布 成 功");
		});
	};

	var reg = function(req, res) {
		res.render('reg', {
			title: '用户注册'
		});
	};

	var doReg = function(req, res) {
		// 检验用户两次输入的口令是否一致
		if (req.body['password-repeat'] != req.body['password']) {
			req.session.error = "两次输入的口令不一致";
			return res.redirect('/reg');
		}

		hash(req.body.password, function(err, salt, hash) {
			if (err) {
				req.session.error = err;
				return res.redirect('/reg');
			}
			// store the salt & hash in the "db"
			var newUser = new User();
			newUser.name = req.body.username;
			newUser.salt = salt;
			newUser.hash = hash;

			// 检查用户名是否已经存在
			User.findOne({
				name: newUser.name
			}, function(err, user) {
				if (user)
					err = 'Username already exists.';
				if (err) {
					req.session.error = err;
					return res.redirect('/reg');
				}
				//如果不存在则新增用户
				newUser.save(function(err) {
					if (err) {
						req.session.error = err;
						return res.redirect('/reg');
					}
					req.session.user = newUser;
					req.session.success = "注册成功";
					res.redirect('/');
				});
			});
		});
	};

	var login = function(req, res) {

		res.render('login', {
			title: '用户登入'
		});
	};

	var doLogin = function(req, res) {

		User.findOne({
			name: req.body.username
		}, function(err, user) {
			if (!user) {
				req.session.error = '用户不存在';
				return res.redirect('/login');
			}
			console.log(req.body.password);
			hash(req.body.password, user.salt, function(err, hash) {
				if (err || hash != user.hash) {
					req.session.error = "用户密码错误";
					return res.redirect('/login');
				}
				if (req.body.remember) {
					var minute = 60000;
					res.cookie('username', user.name, {
						maxAge: minute
					});
				}
				req.session.user = user;
				req.session.success = '登入成功';
				res.redirect('/');
			});
		});
	};

	var logout = function(req, res) {

		req.session.user = null;
		req.session.success = '登出成功';
		res.clearCookie('username');
		res.redirect('/');
	};

	var checkLogin = function(req, res, next) {
		if (!req.session.user) {
			req.session.error = '未登入';
			return res.redirect('/login');
		}
		next();
	};

	var checkNotLogin = function(req, res, next) {
		if (req.session.user) {
			console.log("用户从session提取到");
			req.session.error = '已登入';
			return res.redirect('/');
		} else if (req.cookies.username) {
			console.log("用户从cookie提取到");
			User.findOne({
				name: req.cookies.username
			}, function(err, user) {
				if (!user) {
					req.session.error = "用户不存在";
					return res.redirect('/');
				}
				req.session.user = user;
				req.session.success = '登入成功';
				res.redirect('/');
			});
		}
		next();
	};

	app.get('/', index);
	app.get('/u/:user', user);
	app.post('/post', checkLogin, post);
	app.get('/reg', checkNotLogin, reg);
	app.post('/reg', checkNotLogin, doReg);
	app.get('/login', checkNotLogin, login);
	app.post('/login', checkNotLogin, doLogin);
	app.get('/logout', checkLogin, logout);
};