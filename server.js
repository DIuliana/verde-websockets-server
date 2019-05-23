const express = require('express')
const enableWs = require('express-ws')

const server = express();
enableWs(server);

const socketRouter = require('./resources/sockets/socket.router');

server.use('/verde/socket/pot/:id', function (req, res, next) {
    console.log('middleware');
    req.device = 'pot';
    return next();
});

server.get('/', function (req, res) {
    console.log('get route', req.device);
    res.send('Hello')
    //   res.end();
});

server.use('/verde/socket', socketRouter)

server.listen(3000);
