const SongList = require("./song_list");
const db = require("../lib/db/db");

//TODO: fetch every time grengilbot songs are updated
class HistorySongList extends SongList {
  constructor(songs = []) {
    super(songs);

    this.fetch();
  }

  //fetch songs from history
  fetch() {
    db.getCollection("history", data => {
      this.songs = data
        .chain()
        .find()
        .simplesort("dateAdded", true)
        .data();
    });
  }
}

module.exports = HistorySongList;
