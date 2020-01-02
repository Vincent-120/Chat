let express =require ('express');
let app = express();
let http = require ('http').Server(app);
let io = require ('socket.io')(http);

app.use("/",express.static(__dirname + "/Public"));

http.listen(3000, function(){
    console.log('Server is on http://localhost:3000');
});

io.on('connection', function(socket){
    console.log("Anyone is connected");
    socket.on('disconnect', function () {
        console.log('One people as been leave');
    });
    socket.on('chat-message', function (message) {
        io.emit('chat-message', message);
        console.log(message)
      });
});