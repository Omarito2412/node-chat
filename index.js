var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var session = require('express-session');
var bodyParser = require('body-parser');
var session;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/libs'));
app.use(express.static(__dirname + '/public'));
app.use(session({secret: 'SECRETKODE',
				 saveUninitialized: true,
                 resave: true}));

app.get('/', function(request, resource){
	session = request.session;
	if(session.username) {
		resource.redirect('/main');
		return;
	}
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
	username = request.body.username;
	session = request.session;
	session.username = username;
	resource.redirect('/main');
});

app.get('/config', function(request, resource){
	session = request.session;
	resource.status(200).send({
		username: session.username
	});
});

io.on('connection', function(socket){
        console.log("New user!");

	socket.on('disconnect', function(){
		console.log("A user left");
	});

	socket.on('chat-message', function(message){
		console.log("Sent: " + message.message);
		io.emit('chat-message', message);
	});
});

http.listen(3000, function(){
	console.log('listening on port 3000');
});

