/**
 * List of connected users
 */
var users = [];

// Tout d'abbord on initialise notre application avec le framework Express 
// et la bibliothèque http integrée à node.
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// On gère les requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
app.use("/", express.static(__dirname + "/public"));

io.on('connection', function(socket){
    /**
       * Utilisateur connecté à la socket
     */
    var loggedUser;

    console.log('a user connected');

    /**
   * Déconnexion d'un utilisateur : broadcast d'un 'service-message'
   */
  socket.on('disconnect', function () {
    if (loggedUser !== undefined) {
      console.log('user disconnected : ' + loggedUser.username);
      var serviceMessage = {
        text: 'User "' + loggedUser.username + '" disconnected',
        type: 'logout'
      };
      socket.broadcast.emit('service-message', serviceMessage);
    }
  });

    /**
       * Connexion d'un utilisateur via le formulaire
     */
    socket.on('user-login', function (loggedUser) {
      console.log('user logged in : ' + loggedUser.username);
      user = loggedUser;
      if (loggedUser !== undefined) {
        var serviceMessage = {
          text: 'User "' + loggedUser.username + '" logged in',
          type: 'login'
        };
        socket.broadcast.emit('service-message', serviceMessage);
      }
      /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
   */
    socket.on('chat-message', function (message) {
    message.username = loggedUser.username; // On intègre ici le nom d'utilisateur au message
    io.emit('chat-message', message);
    console.log('Message de : ' + loggedUser.username);
  });
    });

  });

// On lance le serveur en écoutant les connexions arrivant sur le port 3000
http.listen(3000, function(){
  console.log('Server is listening on *:3000');
  
});


