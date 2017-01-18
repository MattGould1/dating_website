var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    //models
    User = mongoose.model('User');
//db
var db = require('./../models/db');

//active users, get active users from the db
//
// returns
// object {
// user_id,
// username,
// profile_pic,
// last_active 
// }
// 
// currently active
router.post('/active_users', function (req, res, next) {
	
});

router.post('/getlikes', function (req, res, next) {
	console.log(req);

	res.json(true);
});

//recently active (can be offline);
router.post('/recent', function (req, res, next) {
	//get the last 12 recent users
	var query = User.find({ profile_pic: { $ne: null } })
		.where('age').gt(16).lt(120)
		.where('username').ne(null)
		query.sort({ 'last_active': -1 })
		.limit(12)
		.exec(function (err, users) {
			res.json(users);
		});
});

module.exports = router;