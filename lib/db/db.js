const Loki = require('lokijs');
const db = new Loki('./lib/db/db.json');

exports.db = db;

exports.init = ()=>{
  dbTry(()=>{
    let defaultCollections = ['songs', 'playlists', 'history'];

    //Initialize each collection if it doesn't already exist.
    for(let collection of defaultCollections){
      if(!db.getCollection(collection)){
        db.addCollection(collection);
      }
    }

    db.saveDatabase();
  });
};

exports.getCollection = (collection)=>{
  return dbTry(()=>{
    return db.getCollection(collection);
  });
};

exports.addToCollection = (collection, data, save=true)=>{
  dbTry(()=>{
    db.getCollection(collection).insert(data);
    if(save) db.saveDatabase();
  })
};

//dbTry loads the db if unloaded then executes callback
function dbTry(callback){
  if(exports.loaded){
    return callback();
  }
  else{
    db.loadDatabase({}, (result)=>{
      exports.loaded = true;
      return callback();
    });
  }
}

//A dirty substitute for distinct...
exports.distinct = (result, id)=>{
  let found = [], ret = [];
  for(let i = 0; i < result.length; i++) {
    if(found.indexOf(result[i][id]) === -1) {
      found.push(result[i][id]);
      ret.push(result[i]);
    }
  }
  return ret;
};
