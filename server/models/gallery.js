var mongoose = require('mongoose');
//user model
var gallerySchema = new mongoose.Schema({
	belongs_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	original: { type: String },
	thumbnail: { type: String },
	avatar: { type: String },	
	created_at: { type: Date, default: Date.now() }
});

var Gallery = mongoose.model('Gallery', gallerySchema);