const sortBy = require("lodash").sortBy;

class SongList {
  constructor(songs = []) {
    this.songs = songs;
    this.shuffle = false; // Weather the playlist is in shuffle mode
    this.songPlaying = { song: {}, playing: false, dispatcher: undefined }; // The current song playing
  }
  /**
   * Adds a song to the playlist, with a random seed
   * @param  {Object} song
   */
  add(song) {
    let baseSeed = 0;

    /*by using currently playing song we ensure
		this song is after it in shufflemode*/
    if (this.songPlaying && this.shuffleMode) {
      baseSeed = this.songPlaying.shuffleSeed;
    }
    song.shuffleSeed = Math.random(baseSeed, 10);
    this.songs.push(song);
  }

  endCurrentSong(next = false) {
    this.songPlaying.autoNext = next; //Determines wether the song automatically goes to the next song on end
    this.songPlaying.dispatcher.end();
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

  /**
   * returns a distinct version of the playlist
   * @param  {Object} songs=this.songs
   */
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
