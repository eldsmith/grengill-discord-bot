
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017/grengilbot';

exports.openDB = ()=>{
  return new Promise((resolve, reject)=>{
    MongoClient.connect(url, function(err, db) {
      if(err) reject(err);
      console.log('Connected successfully to server');
      resolve(db);
    });
  });
};

exports.insertDocuments = (coll, data, callback)=>{
  if(!callback){
    callback = ()=>{};
  }

  exports.openDB().then((db)=>{
    let collection = db.collection(coll);
    collection.insertMany(data, (err, result)=>callback(err, result));
    db.close();
  });
};

exports.findDocuments = (db, coll, data, callback)=>{
  // Get the documents collection
  let collection = db.collection(coll);
  // Find some documents
  collection.find(data).toArray((err, result)=>callback(err, result));
};
