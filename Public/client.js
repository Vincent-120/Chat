$(document).ready(function(){
    let socket = io();
    $('#submit').on('click', function(e){
        e.preventDefault();

        let data = {
            username: $('#username').val(),
            message : $('#message').val()
        }

        socket.emit('new message', data);
    });
function XSSPatcher(texte){
    return texte
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&&#039;")
}
    socket.on('new message', function(data){
        $('#messages').append('<li>' + XSSPatcher(data.username) + ' : ' + XSSPatcher(data.message) + '</li>');
        });
    socket.on('error message', function(phrase){
        $('#response').html(phrase);
        });
    socket.on('last message', function(arr){
        for(i = 0;i < arr.length;i++){
            $("#messages").append('<li>' + XSSPatcher(arr[i]) + '</li>');
        }
    });
});


