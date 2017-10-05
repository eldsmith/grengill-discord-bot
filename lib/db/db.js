const Loki = require("lokijs");
const EventEmitter = new require("events");

class LokiDatabase {
  constructor({ dbName = "db", defaultCollections = [] }) {
    this.db = new Loki("./lib/db/" + dbName + ".json");
    this.defaultCollections = defaultCollections;
    this.dbEmitter = new EventEmitter();

    this.init().then(() => {
      this.ready();
    });
  }

  init() {
    return new Promise((resolve, reject) => {
      this.db.loadDatabase({}, error => {
        if (error) {
          reject(error);
        } else {
          //Initialize each collection if it doesn't already exist.
          this.addCollection(this.defaultCollections);

          resolve(this);
        }
      });
    });
  }

  ready() {
    this.isReady = true;
    this.dbEmitter.emit("ready");
  }

  addCollection(newCollections) {
    this._dbTry().then(() => {
      for (let collection of newCollections) {
        if (!this.db.getCollection(collection)) {
          this.db.addCollection(collection);
        }
      }

      this.db.saveDatabase();
    });
  }
  getCollection(collection) {
    return this._dbTry().then(() => {
      return Promise.resolve(this.db.getCollection(collection));
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
      if (!this.isReady) {
        this.dbEmitter.on("ready", () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = LokiDatabase;

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
