var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    jwt = require('jsonwebtoken'),
    methodOverride = require('method-override'), //used to manipulate POST
    //models
    User = mongoose.model('User');
//db
var db = require('./../models/db');

router.post('/verify', function (req, res, next) {
		// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, db.secret, function(err, decoded) {      
			if (err) {
				res.json({ success: false, message: 'Failed to authenticate token.' });    
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				User.findOne({ _id: req.decoded._id })
				.populate({ path: '_comments', options: { sort: { 'created_at': -1 }}})
				.populate({ path: 'gallery', options: { sort: { 'created_at': -1 }}})
				.populate('_friends', '_id username profile_pic')
				.exec(function (err, user) {
					res.json(user);
				});

				User.update({ _id: decoded._id }, { last_active: Date.now() }, false, function (err, updated) {
				});
			}
		});

	} else {

		// if there is no token
		// return an error
		res.json({ 
			success: false, 
			message: 'No token provided.' 
		});

	}

});

//login
router.post('/login', function (req, res, next) {

	login.login(User, req, jwt, db, function (user) {
		//if user true, send back token
		if (user) {
			User.update({_id: user.user._id}, { lastlogin: Date.now() }, false, function (err, hmm){
				console.log(err); console.log(hmm);
			});
			res.json( user );
		} else {
		//else report failure to client
			res.json ( false );
		}
	});

	User.findOne({ username: req.body.username, password: req.body.password }, function (err, user) {
		if (err) {
			console.log('Error logging in: ' + err);
			res.json(false);
		}

		if (findUser) {
			//sign our token with the users username and _id (username is known by client but _id is not)
			var signWith = {
				username: user.username,
				_id: user._id
			};

			//send back the signed token to the client for authorisation...
			var signedUser = {
				token: jwt.sign( signWith, db.secret, { expires: 60*60*5 }),
				user: user
			};

			//update the last active but make it async so the user can continue on their journey

			User.update({ _id: user._id }, { last_active: Date.now() }, false, function (err, updated) {
				if (err) {
					console.log('error updating the last_active for user ' + user.username);
				} else {
					console.log('successfully updated the last_active field for user' + user.username);
				}
			});

			//send the response back to client immediately
			res.json(signedUser);

		} else {

			console.log('Username or password incorrect!');
			res.json(false);

		}
	});

});

router.post('/signup', function (req, res, next) {

	var data = req.body;
	
	var create_account = {
		username: data.username,
		email: data.email,
		password: data.password,
		gender: data.gender
	};

	//check to see if user exists
	// User.findOne( { email: data.email }, function (err, findUser) {
	// 	//check if err
	// 	if (err) { 
	// 		console.log('error finding user: ' + err);
	// 		res.json(false);
	// 	}

	// 	if (findUser === null) {
			var user = new User(create_account);

			user.save(function (err, saved) {
				if (err) {
					console.log('error saving user: ' + err);
					res.json(false);
				} else {
					console.log('user ' + saved.email + ' successfully saved');
					var signWith = {
						username: saved.username,
						_id: saved._id
					};

					//send back the signed token to the client for authorisation...
					var signedUser = {
						token: jwt.sign( signWith, db.secret, { expires: 60*60*5 }),
						user: saved
					};

					//update the last active but make it async so the user can continue on their journey

					user.update({ _id: saved._id }, { last_active: Date.now() }, false, function (err, updated) {
						if (err) {
							console.log('error updating the last_active for user ' + saved.username);
						} else {
							console.log('successfully updated the last_active field for user' + saved.username);
						}
					});

					//send the response back to client immediately
					res.json(signedUser);
				}
			});
	// 	} else {
	// 		console.log('user ' + create_account.email + ' already exists');
	// 		res.json('user_exists');
	// 	}
	// });


});

//register
router.post('/register', function (req, res, next) {

	var data = req.body;

	//signup data
	var register_user = {
		username: data.username,
		password: data.password,
		first_name: data.first_name,
		last_name: data.last_name,
		email: data.email,
		height: data.height,
		weight: data.weight,
		speak_english: data.speak_english,
		have_children: data.have_children,
		want_children: data.want_children,
		age: data.age,
		country: data.country,
		gender: data.gender,
	};

	//validate the optional fields manually
	if (data.profile_pic) {
		register_user.profile_pic = data.profile_pic;
	}

	if (data.dob) {
		register_user.dob = data.dob;
	}

	if (data.education) {
		register_user.education = data.education;
	}

	if (data.city) {
		register_user.city = data.city;
	}

	if (data.job) {
		register_user.job = data.job;
	}

	if (data.salary) {
		register_user.salary = data.salary;
	}

	if (data.headline) {
		register_user.headline = data.headline;
	}

	if (data.religion) {
		register_user.religion = data.religion;
	}

	if (data.wants) {

		if (data.wants.min_age) {
			register_user.wants.min_age = data.wants.min_age;
		}

		if (data.wants.max_age) {
			register_user.wants.max_age = data.wants.max_age;
		}

		if (data.wants.gender) {
			register_user.wants.gender = data.wants.gender;
		}
	}


	//check to see if user exists
	User.findOne( { username: req.body.username }, function (err, findUser) {
		//check if err
		if (err) { 
			console.log('error finding user: ' + err);
			res.json(false);
		}

		if (findUser === null) {
			var user = new User(register_user);

			user.save(function (err, saved) {
				if (err) {
					console.log('error saving user: ' + err);
					res.json(false);
				} else {
					console.log('user ' + register_user.username + ' successfully saved');
					res.json(true);
				}
			});
		} else {
			console.log('user ' + register_user.username + ' already exists');
			res.json('user_exists');
		}
	});

});


router.get('/test', function (req, res, next) {
	res.json('update me!!!');
});
module.exports = router;