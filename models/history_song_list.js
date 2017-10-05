const SongList = require("./song_list");
const LokiDatabase = require("../lib/db/db");

//TODO: fetch every time grengilbot songs are updated
class HistorySongList extends SongList {
  constructor({ songs = [], dbName = "db" } = {}) {
    super({ songs });

    this.db = new LokiDatabase({ dbName, defaultCollections: ["history"] });
    this.fetch();
  }

  //fetch songs from history
  fetch() {
    this.db.getCollection("history").then(data => {
      this._songs = data
        .chain()
        .find()
        .simplesort("dateAdded", true)
        .data();
    });
  }
}

module.exports = HistorySongList;
