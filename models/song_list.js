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
  shuffled() {
    return sortBy(this.songs, ["shuffleSeed"]);
  }
}

module.exports = SongList;
