

module.exports = {
    "onOpen": function () {
        console.log('onOpen');        
    },

    "onMessage": function (msg) {
        this.send(msg);
        console.log('onMessage');  
    },

    "onClose": function () { 
        console.log(req.params.id);
    }
}