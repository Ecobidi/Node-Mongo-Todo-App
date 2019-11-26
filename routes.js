const fs = require('fs');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/fullstacktodo';

exports.homepage = function(req, res){
    var readStream = fs.createReadStream(path.normalize(__dirname + "/public/index.html"));
    readStream.pipe(res);
}
exports.error = function(req, res){
    console.log('error error error');
    res.end();
};

exports.todos = function(req, res){
    //connect to the database
    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        console.log('Database Connection successfull');
        db.collection('todos').find({}).toArray(function(err, result){
            if(err) throw err;
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(result));
            res.end();
            db.close();
        });
    });
};

exports.newTodo = function(req, res){
    console.log('new todo called');
    var body = '';
    req.on('data', function(data){
        body += data
    });
    req.on('end', function(){
        //connect to the database
        MongoClient.connect(url, function(err, db){
            if(err) throw err;
            console.log('Database Connection successfull');
            body = JSON.parse(body);
            //if body is empty do nothing;
            if(body === '') { return res.end(); };
            db.collection('todos').insert({"title": body}, function(err, result){
                if(err) throw err;
                console.log('insertion successfull');
                res.writeHead(200);
                res.end();
                db.close();
            });
        });
    });
};

exports.deleteTodo = function(req, res){
    var body = '';
    req.on('data', function(data){
        body += data
    });
    req.on('end', function(){
        //connect to the database
        MongoClient.connect(url, function(err, db){
            if(err) throw err;
            console.log('Database Connection successfull');
            body = JSON.parse(body);
            //if body is empty do nothing
            if(body === '') { return res.end(); };

            db.collection('todos').remove({"title": body}, {justOne:true}, function(err, result){
                if(err) throw err;
                db.collection('todos').find({}).toArray(function(err, data){
                    if(err) throw err;
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.write(JSON.stringify(data));
                    console.log(data);
                    res.end();
                    db.close();
                });
            });
        });
    });
};