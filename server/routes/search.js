var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    // jwt = require('jsonwebtoken'),
    methodOverride = require('method-override'), //used to manipulate 
    // multer  = require('multer'),
	// upload = multer({ dest: 'uploads/' }),
    //models
    User = mongoose.model('User');
//db
var db = require('./../models/db');

router.post('/get', function (req, res, next) {

	var search_params = req.body;

	console.log(search_params);

	var query = User
		.find({ profile_pic: { $ne: null } });

	if (search_params.min_age && search_params.max_age) {
		query.where('age').gt(search_params.min_age - 1).lt(search_params.max_age +1)
	} else {
		query.where('age').gt(16).lt(120);
	}
		query.where('username').ne(null);

		//gender doesn't work atm because need new db @TODO fix
		// if (search_params.gender) {
		// 	query.where('gender').equals(search_params.gender);
		// }

		if (search_params.country) {
			query.where('country').equals(search_params.country);
		}

		if (search_params.have_children) {
			query.where('have_children').ne(false);
		} else {
			query.where('have_children').ne(true);
		}
	
	
		query.sort({ 'last_active': -1})
		.limit(10)
		.exec(function (err, users) {
			res.json(users);
		});
});
module.exports = router;