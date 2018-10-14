var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usernameArray = {};
var numOfUsers = 0;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('user joined', function(username){
  	console.log(username + ' has joined');
    numOfUsers++;
    usernameArray[socket.id] = username;
    socket.username = username;

    socket.broadcast.emit('user joined', {
    	username: username,
		usernameArray: usernameArray,
		numOfUsers: numOfUsers
    });
    obj = {
    	username: socket.username,
    	userid: socket.id,
    	usernameArray: usernameArray,
    	numOfUsers: numOfUsers
    };
    console.log(obj);
    io.emit('login', obj);
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', socket.username +': '+ msg);
  });

  //socket.broadcast.emit('Welcome to example chatting server ... ');
  socket.on('disconnect', function(){
    console.log('user disconnected');
    numOfUsers--;

    delete usernameArray[socket.id];
    if (socket.username != undefined) {
	    socket.broadcast.emit('user left', {
	    	id: socket.id,
	    	username: socket.username,
			usernameArray: usernameArray
	    });
    }

  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
