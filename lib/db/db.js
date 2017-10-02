const Loki = require("lokijs");
const db = new Loki("./lib/db/db.json");
const EventEmitter = new require("events");
const dbEmitter = new EventEmitter();

class LokiDatabase {
  constructor(dbName = "db") {
    this.db = new Loki("./lib/db/" + dbName + ".json");
    this.init();
  }

  init() {
    db.loadDatabase({}, error => {
      if (error) {
        // do something
      } else {
        let defaultCollections = ["songs", "playlists", "history"];

        //Initialize each collection if it doesn't already exist.
        for (let collection of defaultCollections) {
          if (!this.db.getCollection(collection)) {
            this.db.addCollection(collection);
          }
        }

        this.db.saveDatabase();
        this.loaded = true;
        dbEmitter.emit("init"); // now that the db has finished initialising, run all init events in the queue.
      }
    });
  }

  getCollection(collection) {
    return this._dbTry().then(() => {
      return Promise.resolve(db.getCollection(collection));
    });
  }

  addToCollection({ collection = "", data = "", save = true } = {}) {
    return this._dbTry().then(() => {
      this.db.getCollection(collection).insert(data);
      if (save) this.db.saveDatabase();
      return Promise.resolve();
    });
  }

  _dbTry() {
    return new Promise((resolve, reject) => {
      if (!this.loaded) {
        dbEmitter.on("init", () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = LokiDatabase;

//dbTry loads the db if unloaded then executes callback
function dbTry(callback, init) {
  // If any db calls are made before init they are queued up
  if (!exports.initialized && !init) {
    dbEmitter.on("init", () => {
      return callback();
    });
  } else if (exports.loaded) {
    return callback();
  } else {
    db.loadDatabase({}, result => {
      exports.loaded = true;
      return callback();
    });
  }
}

//A dirty substitute for distinct...
exports.distinct = (result, id) => {
  let found = [],
    ret = [];
  for (let i = 0; i < result.length; i++) {
    if (found.indexOf(result[i][id]) === -1) {
      found.push(result[i][id]);
      ret.push(result[i]);
    }
  }
  return ret;
};
