// Inisialisation de socket.io coté client
let socket = io();

// Connexion d'un utilisateur
//  Uniquement si le username n'est pas vide et n'existe pas encore
document.getElementById('log').addEventListener('click',(e) => {
  e.preventDefault();
  let user = {
    username: document.getElementById('pseudo').value.trim()
  };

  if(user.username.length > 0) { // Si le champ de connexion n'est pas vide
    socket.emit('user-login', user, function (success) {
      if (success) {
        document.getElementById('logged-out').removeAttribute('id');// Cache formulaire de connexion
        document.getElementById('msg').focus(); // Focus sur le champ du message
      }
    });
  }
});

// Envoi d'un message
document.getElementById('envoyer').addEventListener("click", (e) =>{
  e.preventDefault();
  let message = {
    text: document.getElementById('msg').value
  };
  document.getElementById('msg').value = '';
  if(message.text.trim().length !== 0){ // Gestion message vide
    socket.emit('chat-message', message);
  }
  document.getElementById('msg').focus(); // Focus sur le champ du message
});

//  Réception d'un message
socket.on('chat-message', function (message) {
  document.getElementById('messages').innerHTML+='<li><span class="username">' + message.username + '</span> ' + message.text;
  scrollToBottom();
});

// Réception d'un message de service
socket.on('service-message', function (message) {
  document.getElementById('messages').innerHTML+='<li class="' + message.type + '">' + '<span class="info">information</span> ' + message.text;
  scrollToBottom();
});

// Scroll vers le bas de page si l'utilisateur n'est pas remonté pour lire d'anciens messages
let scrollToBottom = () => {
  if ($(window).scrollTop() + $(window).height() + 2 * $('#messages li').last().outerHeight() >= $(document).height()) {
    $("html, body").animate({
      scrollTop: $(document).height()
    }, 0);
  }
}

// Connexion d'un nouvel utilisateur
socket.on('user-login', function (user) {
  document.getElementById('users').innerHTML +='<li class="' + user.username + ' new">' + user.username + '<span class="typing">typing</span>';
  setTimeout(function () {
    $('#users li.new').removeClass('new');
  }, 1000);
});

// Déconnexion d'un utilisateur
socket.on('user-logout', function (user) {
  let selector = '#users li.' + user.username;
  selector.remove();
});

// Détection saisie utilisateur
let typingTimer;
let isTyping = false;

document.getElementById('msg').addEventListener("beforeinput", () => {
  clearTimeout(typingTimer);
  if (!isTyping) {
    socket.emit('start-typing');
    isTyping = true;
  }
});

document.getElementById('msg').addEventListener('keyup', () => {
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
  document.querySelector('.typing').style.display = 'none';
  for (i = 0; i < typingUsers.length; i++) {
    document.querySelector('#users li.' + typingUsers[i].username + ' span.typing').style.display = "block";
  }
});