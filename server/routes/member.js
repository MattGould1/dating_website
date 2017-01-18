var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    jwt = require('jsonwebtoken'),
    methodOverride = require('method-override'), //used to manipulate 
    multer  = require('multer'),
	upload = multer({ dest: 'uploads/' }),
    //models
    User = mongoose.model('User');
//db
var db = require('./../models/db');

//register
router.get('/test', function (req, res, next) {
	res.json('sup');
});

router.post('/fetchUser', function (req, res, next) {


	if (req.body.userid === 'me') {
		req.body.userid = req.decoded._id;
	}
	
	User.find({ _id: req.body.userid })
	.populate({ path: '_comments', options: { sort: { 'created_at': -1 }}})
	.populate({ path: 'gallery', options: { sort: { 'created_at': -1 }}})
	.exec(function (err, user) {
		res.json(user);
	});
});

module.exports = router;