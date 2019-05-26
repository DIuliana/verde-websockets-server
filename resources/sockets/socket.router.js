const { Router } = require('express');
const socket = require('./socket.controllers');

const router = Router();
const websocket = {};

router
    .ws('/pot/:id', function (ws, req) {
        websocket[req.params.id] = websocket[req.params.id] ? { ...websocket[req.params.id], pot: req.ws } : { pot: req.ws };

        req.ws.send(`Hello, pot ${req.params.id}! You are connected`)
        ws.on('message', (msg) => {
            socket.onMessage(websocket[req.params.id].mobile, msg)
        });
        ws.on('close', () => {
            socket.onClose.pot(websocket, req.params.id);
        }); // move to db
        console.log('pot socket route');
    });

router
    .ws('/mobile/:id', function (ws, req) {
        websocket[req.params.id] = websocket[req.params.id] ? { ...websocket[req.params.id], mobile: req.ws } : { mobile: req.ws };

        req.ws.send(`Hello, mobile ${req.params.id}! You are connected`)
        ws.on('message', (msg) => {
            socket.onMessage(websocket[req.params.id].pot, msg)
        });
        ws.on('close', () => {
            socket.onClose.mobile(websocket, req.params.id);
        });; // move to db
        console.log('mobile socket route');
    });


module.exports = router;