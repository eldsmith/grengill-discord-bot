const SongList = require("./song_list");
const LokiDatabase = require("../lib/db/db");
const db = new LokiDatabase();

//TODO: fetch every time grengilbot songs are updated
class HistorySongList extends SongList {
  constructor({ songs = [] } = {}) {
    super({ songs });

    this.fetch();
  }

  //fetch songs from history
  fetch() {
    db.getCollection("history").then(data => {
      this._songs = data
        .chain()
        .find()
        .simplesort("dateAdded", true)
        .data();
    });
  }
}

module.exports = HistorySongList;
