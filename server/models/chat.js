// var mongoose = require('mongoose');
// //user model
// var commentSchema = new mongoose.Schema({
// 	currentUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
// 	userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
// 	username: { type: String },
// 	avatar: { type: String },
// 	comment: { type: String },
// 	like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
// 	created_at: { type: Date, default: Date.now() }
// });

// var Comment = mongoose.model('Comment', commentSchema);


var mongoose = require('mongoose');

var chatMessageSchema = new mongoose.Schema({
	_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	_sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	message: { type: String, required: true },
	username: { type: String },
	avatar: { type: String },
	created_at: { type: Date, default: Date.now() }
});

var ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);