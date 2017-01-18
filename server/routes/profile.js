var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    jwt = require('jsonwebtoken'),
    methodOverride = require('method-override'), //used to manipulate 
    multer  = require('multer'),
	upload = multer({ dest: 'uploads/' }),
    //models
    gm = require('gm').subClass({imageMagick: true}),
    fs = require('fs'),
    sharp = require('sharp'),
    Comment = mongoose.model('Comment'),
    User = mongoose.model('User'),
    ChatMessage = mongoose.model('ChatMessage'),
	_ = require('lodash'),
    Gallery = mongoose.model('Gallery');
//db
var db = require('./../models/db');

//register
router.get('/test', function (req, res, next) {
	res.json('sup');
});

router.post('/update', function (req, res, next) {

	var data = req.body;
	var key;
	var details = {};

	console.log(data);
	for (key in data) {
		if (key === 'dob') {
			details[key] = data[key].time;
		} else if (key === 'wants') {
			var new_key;
			details.wants = {};
			for (new_key in data.wants) {

				details.wants[new_key] = data.wants[new_key];
			}
		} else {
			details[key] = data[key];
		}
	}

	User.findByIdAndUpdate(req.decoded._id, details, {new: true}, function (err, user) {
		console.log(user);
		res.json(details);
	});
});

router.post('/love', function (req, res, next) {
	User.findOne({ _id: req.body.userid}, function (err, user) {

		var set = _.findIndex(user.__love, function (o) {
			return o.by === req.decoded._id;
		});

		if (set === -1) {
			user.__love.push({
				for: req.body.userid,
				by: req.decoded._id,
				viewed: false
			});

			user.save();
		}

		res.json(true);
	});
});

router.post('/like', function (req, res, next) {
	User.findOne({ _id: req.body.userid}, function (err, user) {
		var set = _.findIndex(user.__like, function (o) {
			return o.by === req.decoded._id;
		});

		if (set === -1) {
			user.__like.push({
				for: req.body.userid,
				by: req.decoded._id,
				viewed: false
			});

			user.save();
		}

		res.json(true);
	});
});

router.post('/addfriend', function (req, res, next) {
	User.findByIdAndUpdate(req.decoded._id, { $addToSet: { _friends: req.body._id }}, function (err, user) {
		res.json(true);
	});

	//send a friends request to the other guy as well
	User.findByIdAndUpdate(req.body._id, { $addToSet: { _friend_requests: req.decoded._id }}, function (err, user) {

	});
});

router.post('/acceptFriend', function(req, res, next) {
	User.findByIdAndUpdate(req.decoded._id, { 
		$addToSet: { _friends: req.decoded._id },
		$pull: { _friend_requests: req.decoded._id, _friend_blocked: req.decoded._id }
	}, function (err, user) {
		res.json(true);
	});
});

router.post('/blockFriend', function(req, res, next) {
	User.findByIdAndUpdate(req.decoded._id, { 
		$addToSet: { _friend_blocked: req.body._id },
		$pull: { _friends: req.body._id, _friend_requests: req.body._id }
	}, function (err, user) {
		//clean from there's and add you to their block list... (we can unblock later)
		User.findByIdAndUpdate(req.body._id, {
			$addToSet: { _friend_blocked: req.decoded._id },
			$pull: { _friends: req.decoded._id },
		}, function (err, user) {
			res.json(true);
		});
	});
});

router.post('/messages', function (req, res, next) {

	var wherein = [
		req.body._to,
		req.body._sender
	];

	ChatMessage.find({})
		.where('_to')
		.in(wherein)
		.where('_sender')
		.in(wherein)
		.limit(5)
		.exec(function(err, messages) {
			res.json(messages);
		});
});

router.post('/comment', function (req, res, next) {
	console.log(req.body);
	User.findOne({ _id: req.body.userid }, function (err, user) {
		var comment = new Comment(req.body);

		comment.save(function (err, comment) {
			console.log(comment);
			if (!user._comments) {
				user._comments = [];
			}
			user._comments.push(comment._id);
			user.save(function (err, user) {
				res.json(comment);
			});
		});
	});
});

router.post('/delete-image', function (req, res, next) {

	var id = req.body._id;
	
	Gallery.findById(id).remove().exec(function (err, success) {
		console.log(success);
		res.json(true);
	});
});

router.post('/upload', upload.fields([{ name: 'profile_pic', maxCount: 1 }, { name: 'gallery', maxCount: 2 }]) , function (req, res, next) {

	if (req.files['gallery']) {
		var crop = req.files['gallery'][0];

		var original = './' + crop.path;
		var thumbnail = original + '-thumbnail';
		var avatar = original + '-avatar'
		var belongs_to = req.decoded._id;

		gm(original)
			.resize(300, 300, "!")
			.write(thumbnail, function (err) {

				gm(original)
					.resize(50,50, "!")
					.write(avatar, function (err) {


						var image = new Gallery({
							belongs_to: belongs_to,
							original: original,
							avatar: avatar,
							thumbnail: thumbnail
						});

						image.save(function (err, image) {
							User.findById(belongs_to, function (err, user) {
								if (!user.gallery) {
									user.gallery = [];
								}

								user.gallery.push(image._id);

								user.save(function (err, user) {
									res.json(image);
								});
							});
						});
					});

			});
	}

	if (req.files['profile_pic']) {
		var crop = req.files['profile_pic'][0];
		var cropsize = req.body;

		var cropwidth = String(Math.round(cropsize.toCropImgW));
		var cropheight = String(Math.round(cropsize.toCropImgH));
		var cropx = String(Math.round(cropsize.toCropImgX));
		var cropy = String(Math.round(cropsize.toCropImgY));

	 	if (req.body.request === 'crop') {
	 		var src = './' + crop.destination + crop.filename;
			var dst = './' + crop.destination + crop.filename + '-thumbnail';
			var dstavatar = './' + crop.destination + crop.filename + '-avatar';

			gm(src)
				.crop(cropwidth, cropheight, cropx, cropy)
				.resize(300, 300, "!")
				.write(dst, function (err) {

					gm(src)
					.crop(cropwidth, cropheight, cropx, cropy)
					.resize(50,50,"!")
					.write(dstavatar, function (err) {

						var details = {};
						details['profile_pic'] = crop.filename;

						User.findByIdAndUpdate(req.decoded._id, details, { new: true }, function (err, user) {
							res.json({ profile_pic: user.profile_pic });
						});
					});
				});
	 	}
	}
});

router.post('/getlikes', function (req, res, next) {

	User.findOne({ _id: req.body.id })
	.populate('like', '_id username profile_pic')
	.exec(function (err, user) {
		res.json(user.like);
	});

});

module.exports = router;