var path = require('path');
var routes = require('./routes.js');
var fs = require('fs');
var mime = require('mime');

var handler = {
    '/': routes.homepage,
    '/todos': routes.todos,
    '/todo/new': routes.newTodo,
    '/todo/delete': routes.deleteTodo
};
module.exports = function(req, res){
    var filepath = req.url;
    var publicPath = path.normalize(__dirname + '/public');
    //checks if the req url is a specified route
    if(typeof handler[filepath] === 'function'){
        handler[filepath](req, res);
    }
    else { // else check if it is public assets file
        fs.exists(publicPath, function(exists){
            if(exists) {
                console.log(publicPath);
                fs.stat(publicPath + filepath, function(err, stats){
                    if(err){
                        //if there is an error then the filepath is invalid
                        routes.error(req, res);
                    } else {
                        if(stats.isFile()){
                            var mimeType = mime.lookup(publicPath + filepath);
                            var readStream = fs.createReadStream(publicPath + filepath);
                            res.writeHead(200, { 'Content-Type': mimeType });
                            readStream.pipe(res);
                        }
                    }
                });
            }
            else {
                //serve an error response
                routes.error(req, res);
            }
        });
    }
    
};