const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost:27017/UserDatabase';

mongoose.connect(mongoDB,{useNewUrlParser:true});

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open',function(){
    console.log(' mongodb connected');
}).on('error', function(){
    console.log('mongodb connection error');
});