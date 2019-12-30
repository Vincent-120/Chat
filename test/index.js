const app = require('express')();
const http = require('http').createServer(app);
const port = 8080;
app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

http.listen(port, function(){
  console.log('Serveur tourne sur http://localhost:'+port);
});
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });



// const http = require('http');
// const port = 8080;
// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write('<h1> <em>Salut tout le monde!</em></h1>');
//     res.end();
//     }).listen(port);
//     console.log("Serveur tourne sur http://localhost:"+port);