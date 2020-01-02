var socket = io();

$('form').submit(function(e) {
	e.preventDefault(); // On évite le recharchement de la page lors de la validation du formulaire
    // On crée notre objet JSON correspondant à notre message
	var message = {
		text : $('#m').val()
	}
	socket.emit('chat-message', message); // On émet l'événement avec le message associé
    $('#m').val(''); // On vide le champ texte
    if (message.text.trim().length !== 0) { // Gestion message vide
    socket.emit('chat-message', message);
    }
    $('#chat input').focus(); // Focus sur le champ du message
});
  /**
   * Réception d'un message
   */
  socket.on('chat-message', function (message) {
    $('#messages').append($('<li>').text(message.text));
});
