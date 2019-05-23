const { Router } = require('express');
const pot = require('./pot.controllers');

const router = Router();
const websocket = {};

router
    .ws('/pot/:id', function (ws, req) {
        websocket[req.params.id] = websocket[req.params.id] ? { ...websocket[req.params.id], pot: req.ws } : { pot: req.ws };

        req.ws.send(`Hello, pot ${req.params.id}! You are connected`)
        ws.on('message', (msg) => { websocket[req.params.id].mobile.send(msg) });
        ws.on('close', () => { delete websocket[req.params.id].pot }); // move to db
        console.log('pot socket route');
    });

router
    .ws('/mobile/:id', function (ws, req) {
        websocket[req.params.id] = websocket[req.params.id] ? { ...websocket[req.params.id], mobile: req.ws } : { mobile: req.ws };

        req.ws.send(`Hello, mobile ${req.params.id}! You are connected`)
        ws.on('message', (msg) => { websocket[req.params.id].pot.send(msg) });
        ws.on('close', () => { delete websocket[req.params.id].mobile }); // move to db
        console.log('mobile socket route');
    });


module.exports = router;