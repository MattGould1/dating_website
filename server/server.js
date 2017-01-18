var path = require('path'),
	logger = require('morgan'),
	express = require('express'),
	cookieParser = require('cookie-parser'),
	mongoose = require('mongoose'),
	jwt = require('jsonwebtoken'),
	bodyParser = require('body-parser'),
	http = require('http'),
	users = {},
	cUser,
	fs = require('fs'),
	socketioJwt = require('socketio-jwt');

//models
var db = require('./models/db');
var user = require('./models/user');
var comment = require('./models/comment');
var gallery = require('./models/gallery');
var chatmessage = require('./models/chat');


//setup smtp emails
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
//var transporter = nodemailer.createTransport('smtps://matt%40saowapan.com:9VAV=SuD@smtp.gmail.com');

//routes
var index = require('./routes/index');
var profile = require('./routes/profile');
var content = require('./routes/content');
var member = require('./routes/member');
var search = require('./routes/search');

//init models
var User = mongoose.model('User');
var Comment = mongoose.model('Comment');
var Gallery = mongoose.model('Gallery');
var chatMessage = mongoose.model('ChatMessage');

//express
var app = express();

//helpers
var imageupload = require('./modules/imageupload');

//enable cors
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'x-access-token, Content-Type');
  next();
});

app.all('/auth/*', function (req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.headers['x-access-token'];
	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, db.secret, function(err, decoded) {     
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });    
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;    
				next();
			}
		});
	} else {
		return res.json({ 
			success: false, 
			message: 'No token provided.' 
		});

	}

});

app.use(bodyParser.json());       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
// 	extended: true
// }));

//read cookies
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + '/uploads'));

//use routes
app.use('/', index);
app.use('/auth/profile', profile);
app.use('/auth/member', member);
app.use('/content', content);
app.use('/auth/search', search);

//connect to db
mongoose.connect(db.database);

//setup io
var server = http.createServer(app);


var io = require('socket.io')(server);

// //for chat and real time stuff
// io.sockets
// 	.on('connection', socketioJwt.authorize({
// 	secret: db.secret,
// 	handshake: true
// })).on('authenticated', function(socket) {
// 	console.log(socket.decoded_token);
// });

io.on('connection', socketioJwt.authorize({
	secret: db.secret,
	handshae: true
}))
.on('authenticated', function (socket) {
	//join my own room, this will enable people to send messages to me through my own room
	
	socket.join(socket.decoded_token._id);
	socket.on('joinRoom', function (data) {
		socket.join(data._id);
	});

	socket.on('message', function (data) {
		io.sockets.to(data._id).emit('sendMessage', data);
		data._to = data._id;
		delete data['_id'];
		var chat = new chatMessage(data);
		chat.save(function (err, save) {
			console.log(err);
		});
	});

	setInterval(function () {
		socket.emit('helloworld', 'hello world');
	}, 2000);
})

//function for testing
setInterval(function () {
	console.log('MEMORY:', process.memoryUsage().heapUsed / 1024 / 1024, 'MB');
}, 5000);

//start listening
server.listen(8088, function(){
	console.log('server up');
});

module.exports = app, io;