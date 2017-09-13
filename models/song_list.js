const sortBy = require("lodash").sortBy;

class SongList {
  constructor(songs = []) {
    this.songs = songs;
  }

  /**
   * returns a new shuffled list of songs
   * @param  {Object} songs=this.songs
   * @returns {SongList[]}
   */
  mix(songs = this.songs) {
    let mixedList = [...songs];
    for (let i = mixedList.length; i >= 1; i--) {
      let rand = Math.floor(Math.random() * i);
      [mixedList[i - 1], mixedList[rand]] = [mixedList[rand], mixedList[i - 1]];
    }

    return mixedList;
  }
  /**
   * returns a static shuffled version of the list, does not reshuffle the list like mix
   * @returns {SongList[]}
   */
  shuffled(songs = this.songs) {
    return sortBy(songs, ["shuffleSeed"]);
  }

  distinct(songs = this.songs) {
    let found = [],
      ret = [];
    for (let i = 0; i < songs.length; i++) {
      if (found.indexOf(songs[i].id) === -1) {
        found.push(songs[i].id);
        ret.push(songs[i]);
      }
    }

    return ret;
  }
}

module.exports = SongList;
