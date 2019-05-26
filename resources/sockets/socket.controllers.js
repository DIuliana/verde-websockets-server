

module.exports = {
    "onOpen": function () {
        console.log('onOpen');
    },

    "onMessage": function (websocket, msg) {
        if (websocket) {
            websocket.send(msg)
        }
    },

    "onClose": {
        pot: function (websocket, id) {
            delete websocket[id].pot
        },
        mobile: function (websocket, id) {
            delete websocket[id].mobile
        }
    }
}