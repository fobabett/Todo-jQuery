var mongoose = require('mongoose');
var mongodb = require('mongodb');
// var MongoClient = mongodb.MongoClient;
// var ObjectID = mongodb.ObjectID;
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
// chang connection string to moongoose 
var CONNECTION_STRING = 'mongodb://localhost:27017/todosdb';
// DBPASS=password nodemon server/app.js
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

var todoSchema = mongoose.Schema({
  title: String,
  completed: String
})

var Model = mongoose.model('Model', todoSchema);
var Todo = moongoose.model('Todo', {title: String, completed: String});

function connect_to_db (cb) {
  MongoClient.connect(CONNECTION_STRING, function(err, db) {
    if(err) {
      throw err;
    }
    var collection = db.collection('todos');

    cb( db, collection );

  });
}

app.get('/items',function (req, res) {
  // Todo.find(function(err, todos) {
      // if(err) else res.send(todos)
    //})
  connect_to_db( function ( db, collection ) {
    collection.find({}).toArray(function (err, docs) {
      db.close();
      res.send(docs);
    });
  });

});


app.post('/items',function (req, res) {
    
  // var todo = new Todo(req.body.new_item);
  // todo.save(function(err){
    // if(err)/else res.send(todo._id);
  // })

  connect_to_db( function ( db, collection ) {
    var new_todo_item_to_be_inserted = req.body.new_item;

    collection.insert( new_todo_item_to_be_inserted, function (err, docs) {
      db.close();
      res.send( docs[0]._id );
    });
  });

});

app.put('/items/:id/:status',function (req, res) {
                // update query, what your querying for, callback
  // Todo.update({
    // '_id': new ObjectID(req.body._id)
  // }, {
    // 'completed': req.body.completed
  // }, funciton(err) if(err)/else res.send(success message))

  connect_to_db( function ( db, collection ) {
    var todo_id = req.params.id;
    var todo_completed_status = req.params.status;

    collection.update(
      { '_id' : new ObjectID(todo_id) },   
      {
        $set: {
          completed : todo_completed_status
        }
      },                                   
      {w:1},                               
      function(err) {                       
        var success;
        if (err){
          success = false;
          console.warn(err.message);
        }else{
          success = true;
          console.log('successfully updated');
        }

        db.close();
        res.json( { success : success } );
      }
    );
  });

});

app.delete('/items/:id',function (req, res) {
  // Todo.remove({
    // 'id': req.params.item_id
  // },function(err))

  connect_to_db( function ( db, collection ) {
    var _id = req.params.id;
    collection.remove({"_id": new ObjectID( _id )}, function (err, result) {
      if( err ) throw err;
      
      db.close();
      res.json({ success : "success" });
    });
  });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port)
});