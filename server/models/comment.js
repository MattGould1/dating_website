var mongoose = require('mongoose');
//user model
var commentSchema = new mongoose.Schema({
	currentUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	username: { type: String },
	avatar: { type: String },
	comment: { type: String },
	like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	created_at: { type: Date, default: Date.now() }
});

var Comment = mongoose.model('Comment', commentSchema);