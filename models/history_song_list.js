const SongList = require("./song_list");
const LokiDatabase = require("../lib/db/db");

//TODO: fetch every time grengilbot songs are updated
class HistorySongList extends SongList {
  constructor({ songs = [], dbName = "db" } = {}) {
    super({ songs });

    this.db = new LokiDatabase({ dbName, defaultCollections: ["history"] });
    this.get(); // fetches from the db
  }

  /**
   * @returns {Promise}
   */
  get() {
    return this.db
      .getCollection("history")
      .then(data => {
        return data
          .chain()
          .find()
          .simplesort("dateAdded", true)
          .data();
      })
      .then(songs => {
        this._songs = songs; //Shouldn't be necessary but someone starts doing stupid stuff.
      });
  }
}

module.exports = HistorySongList;
