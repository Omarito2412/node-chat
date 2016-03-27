var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(request, resource){
	resource.sendFile(__dirname + '/index.html');
});

app.get('/main', function(request, resource){
	resource.sendFile(__dirname + '/main.html');
});

app.use(express.static(__dirname + '/libs'));
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
        console.log("New user!");

	socket.on('disconnect', function(){
		console.log("A loser left");
	});

	socket.on('chat-message', function(message){
		console.log("Sent: " + message);
		io.emit('chat-message', message);
	});
});

http.listen(3000, function(){
	console.log('listening on port 3000');
});

