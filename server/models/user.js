var mongoose = require('mongoose');

var loveSchema = new mongoose.Schema({
	for: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	created_at: { type: Date, default: Date.now() },
	updated_at: { type: Date, default: Date.now() },
	new: { type: Boolean, default: false },
	viewed: { type: Boolean, default: false }
});

var likeSchema = new mongoose.Schema({
	for: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	by: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	created_at: { type: Date, default: Date.now() },
	updated_at: { type: Date, default: Date.now() },
	new: { type: Boolean, default: false },
	viewed: { type: Boolean, default: false }
});

var userSchema = new mongoose.Schema({

	//require fields when signing up
	email: { type: String, required: true },
	password: { type: String, required: true },
	gender: { type: String, required: true },
	username: { type: String, index: true}, //add unique true later
	first_name: { type: String},
	last_name: { type: String },
	height: { type: Number },
	weight: { type: Number },
	speak_english: { type: String },
	have_children: { type: Boolean },
	want_children: { type: Boolean },
	age: { type: Number },
	country: { type: String },
	
	// //optional when signing up
	profile_pic: { type: String },
	thumbnail: { type: String },
	avatar: { type: String },
	dob: { type: String },
	education: { type: String },
	// city: { type: String },
	job: { type: String },
	salary: { type: Number },
	// headline: { type: String },
	religion: { type: String },
	wants: {
		min_age: { type: Number },
		max_age: { type: Number },
		gender: { type: String }
	},
	background: { type: String },
	__love: [loveSchema],
	__like: [likeSchema],
	love: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	viewed_love: [ String ],
	viewed_like: [ String ],
	like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	_comments:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
	// //after signup
	biography: { type: String },
	gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gallery' }],
	// background_image: { type: String },

	last_active: { type: Date, default: Date.now() },
	joined: { type: Date, default: Date.now() },
	_messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat'}],
	_friends: [ {type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	_friend_requests: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	_friend_blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

var User = mongoose.model('User', userSchema);