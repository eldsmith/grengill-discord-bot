const Loki = require('lokijs');
const db = new Loki('./lib/db/db.json');

exports.init = ()=>{
  db.loadDatabase({}, (result)=>{
    let defaultCollections = ['songs', 'playlists', 'history'];

    //Initialize each collection if it doesn't already exist.
    for(let collection of defaultCollections){
      if(!db.getCollection(collection)){
        db.addCollection(collection);
      }
    }

    db.saveDatabase();
  })
};
