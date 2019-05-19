const express = require('express')
const enableWs = require('express-ws')

const server = express();
var expressWS = enableWs(server);
var wsServer = expressWS.getWss();

var connections = {};

wsServer.on('connection', function (ws, req) {

    if (req && ws.readyState === ws.OPEN) {
        console.log('connection opened for: ' + req.url);
        ws.send('Successfully connected client');

        var socketId = req.params.id;
        if (connections[socketId] == undefined) {
            connections[socketId] = {};
        }
        if (req.url.includes('mobile')) {
            connections[socketId].mobileSocket = ws;
        }
        else if (req.url.includes('pot')) {
            connections[socketId].potSocket = ws;
        }
        console.log(connections);
    }
});

server.ws('/verde/socket/mobile/:id', (ws, req) => {

    var socketId = req.params.id;

    ws.on('message', msg => {
        console.log("Received message: [" + msg + "] from MOBILE [" + socketId + "]");
        var corespondingPotSocket = connections[socketId].potSocket;
        if (corespondingPotSocket) {
            console.log('Sending message from POT [' + socketId + ']: ' + "\"" + msg + "\"" + " to MOBILE");
            corespondingPotSocket.send(msg);
        }

    })

    ws.on('close', () => {
        connections[socketId].mobileSocket = {};
        console.log("WebSocket for " + req.url + " was closed");
    })
})

server.ws('/verde/socket/pot/:id', (ws, req) => {
    var socketId = req.params.id;

    ws.on('message', msg => {
        console.log("Received message: [" + msg + "] from POT [" + socketId + "]");

        var corespondingMobileSocket = connections[socketId].mobileSocket;
        if (corespondingMobileSocket) {
            console.log('Sending message from POT [' + socketId + ']: ' + "\"" + msg + "\"" + " to MOBILE");
            corespondingMobileSocket.send(msg);
        }
    })

    ws.on('close', () => {
        console.log("WebSocket for " + req.url + " was closed");
        connections[socketId].potSocket = {};
    })
})

server.listen(3000)
