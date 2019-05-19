var express = require('express');
var http = require('http')
var socketio = require('socket.io');

var app = express();
var server = http.Server(app);
var websocket = socketio(server);

server.listen(3000, () => console.log('listening on *:3000'));
var clients = {};

// The event will be called when a client is connected.
websocket.on('connection', (socket) => {
    clients[socket.id] = socket;
    socket.on('message', (message) => { onMessageReceived(message, socket) });
    socket.on('chat', (message) => { onChatRecieved(message, socket) })
    console.log('A client just joined on', socket.id);
});

var chatEnc = false

function onChatRecieved(message, socket) {
    if (chatEnc == false) {
        console.log('Chat encontrado, conectando punto a punto:')
    }
    console.log('Usuario: ' + message)
    chatEnc = true;
}

function onMessageReceived(message, senderSocket) {
    //var userId = users[senderSocket.id];
    console.log('funcionaaaaaaaaaaaaa')
    //if (!userId) return;

    //_sendAndSaveMessage(message, senderSocket);
}

var stdin = process.openStdin();

function _sendAndSaveMessage(message, socket, fromServer) {
    var messageData = {
        text: message.text,
        user: message.user,
        createdAt: new Date(message.createdAt),
        chatId: 0
    };
    var emitter = fromServer ? websocket : socket.broadcast;
    emitter.emit('message', [message]);
}

function _sendAndSaveChat(message, socket, fromServer) {
    var messageData = {
        text: message.text,
        user: message.user,
        createdAt: new Date(message.createdAt),
        chatId: 0
    };
    var emitter = fromServer ? websocket : socket.broadcast;
    emitter.emit('chat', [message]);
}

stdin.addListener("data", function (d) {
    if (!chatEnc) {
        _sendAndSaveMessage({
            text: d.toString().trim(),
            createdAt: new Date(),
            user: { _id: 'robot' }
        }, null /* no socket */, true /* send from server */);
    } else {
        _sendAndSaveChat({
            text: d.toString().trim(),
            createdAt: new Date(),
            user: { _id: 'robot' }
        }, null /* no socket */, true /* send from server */);
    }
});