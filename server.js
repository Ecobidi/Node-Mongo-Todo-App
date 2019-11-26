const http = require('http');
module.exports = function(router){
    var server = http.createServer(function(req, res){
        router(req, res);
    });

    server.listen(4000, function(){
        console.log('Server is running on port 4000');
    });
};