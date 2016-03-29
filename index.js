var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var session = require('express-session');
var bodyParser = require('body-parser');

// Define the application's config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Load static content from these folders
app.use(express.static(__dirname + '/libs'));
app.use(express.static(__dirname + '/public'));
// Initialize sessions
app.use(session({secret: 'SECRETKODE',
				 saveUninitialized: true,
                 resave: true}));

// Define routes
app.get('/', function(request, resource){
	// Retrieve session variable
	session = request.session;
	// Check if username is defined
	if(session.username) {
		// Redirect to chat room
		resource.redirect('/main');
		return;
	} // else, show username form
	resource.sendFile(__dirname + '/index.html');
});

app.get('/main', function(request, resource){
	session = request.session;
	if(!session.username) {
		resource.redirect('/');
		return;
	}
	resource.sendFile(__dirname + '/main.html');
});

app.post('/', function(request, resource){
	// Retrieve username from POST
	username = request.body.username;
	session = request.session;
	// Set username in session to the request's username
	session.username = username;
	// Redirect to chat room
	resource.redirect('/main');
});

// Route for angularjs
app.get('/config', function(request, resource){
	session = request.session;
	resource.status(200).send({
		username: session.username
	});
});

// On connection do
io.on('connection', function(socket){
        console.log("New user!");
        // When this socket disconnects
	socket.on('disconnect', function(){
		console.log("A user left");
	});
		// When this socket sends a message
	socket.on('chat-message', function(message){
		console.log("Sent: " + message.message);
		io.emit('chat-message', message);
	});
});

// Start web server on port 3000
http.listen(3000, function(){
	console.log('listening on port 3000');
});

