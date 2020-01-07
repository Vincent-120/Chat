// Inisialisation de socket.io coté client
let socket = io();

// Connexion d'un utilisateur
//  Uniquement si le username n'est pas vide et n'existe pas encore
$('#login form').submit(function (e) {
  e.preventDefault();
  let user = {
    username: $('#login input').val().trim()
  };
  if (user.username.length > 0) { // Si le champ de connexion n'est pas vide
    socket.emit('user-login', user, function (success) {
      if (success) {
        $('body').removeAttr('id'); // Cache formulaire de connexion
        $('#chat input').focus(); // Focus sur le champ du message
      }
    });
  }
});

// Envoi d'un message
$('#chat form').submit(function (e) {
  e.preventDefault();
  let message = {
    text: $('#m').val()
  };
  $('#m').val('');
  if (message.text.trim().length !== 0) { // Gestion message vide
    socket.emit('chat-message', message);
  }
  $('#chat input').focus(); // Focus sur le champ du message
});

//  Réception d'un message
socket.on('chat-message', function (message) {
  $('#messages').append($('<li>').html('<span class="username">' + message.username + '</span> ' + message.text));
  scrollToBottom();
});

// Réception d'un message de service
socket.on('service-message', function (message) {
  $('#messages').append($('<li class="' + message.type + '">').html('<span class="info">information</span> ' + message.text));
  scrollToBottom();
});

// Scroll vers le bas de page si l'utilisateur n'est pas remonté pour lire d'anciens messages
function scrollToBottom() {
  if ($(window).scrollTop() + $(window).height() + 2 * $('#messages li').last().outerHeight() >= $(document).height()) {
    $("html, body").animate({
      scrollTop: $(document).height()
    }, 0);
  }
}

// Connexion d'un nouvel utilisateur
socket.on('user-login', function (user) {
  $('#users').append($('<li class="' + user.username + ' new">').html(user.username + '<span class="typing">typing</span>'));
  setTimeout(function () {
    $('#users li.new').removeClass('new');
  }, 1000);
});

// Déconnexion d'un utilisateur
socket.on('user-logout', function (user) {
  let selector = '#users li.' + user.username;
  $(selector).remove();
});

// Détection saisie utilisateur
let typingTimer;
let isTyping = false;

$('#m').keypress(function () {
  clearTimeout(typingTimer);
  if (!isTyping) {
    socket.emit('start-typing');
    isTyping = true;
  }
});

$('#m').keyup(function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(function () {
    if (isTyping) {
      socket.emit('stop-typing');
      isTyping = false;
    }
  }, 500);
});

//  Gestion saisie des autres utilisateurs
socket.on('update-typing', function (typingUsers) {
  $('#users li span.typing').hide();
  for (i = 0; i < typingUsers.length; i++) {
    $('#users li.' + typingUsers[i].username + ' span.typing').show();
  }
});