const { sortBy, isString, isFunction, get } = require("lodash");
const err = require("../lib/errors");

class SongList {
  constructor({ songs = [], currentTrack = 1 } = {}) {
    this.songs = [];
    this.songPlaying = { song: {}, playing: false, dispatcher: undefined }; // The current song playing
    this.currentTrack = currentTrack;
    this.defaultSorts = {
      shuffle: songs => {
        return sortBy(songs, ["shuffleSeed"]);
      }
    };

    songs.map(song => {
      this.add(song);
    });
  }

  /**
   * Adds a song to the playlist, with a random seed
   * @param  {Object} song
   */
  add(song) {
    let baseSeed = 0;

    /* FIXME: does not work currently
    by using currently playing song we ensure
		this song is after it in shufflemode*/
    if (this.songPlaying && this.shuffleMode) {
      baseSeed = this.songPlaying.shuffleSeed;
    }
    song.shuffleSeed = Math.random(baseSeed, 10);
    this.songs.push(song);
  }

  /**
   * Gets the playlist
   * @param  {function || string} {sort=false
   * @param  {Object[]} songs=this.songs}={}
   * @returns {Object[]} songs
   */
  get({ sort = false, songs = this.songs } = {}) {
    if (isString(sort)) {
      let sortFun = get(this.defaultSorts, sort);
      if (sortFun) {
        return sortFun(songs);
      }
    } else if (isFunction(sort)) {
      return sort(songs);
    }
    return songs;
  }

  /**
   * Gets the next track from the playlist based on params passed in
   * @param  {Object[]} {songs=this.songs
   * @param  {Int} skip=1
   * @param  {Boolean} newCurrentTrack=true
   * @param  {function} sort=false
   * @param  {Boolean} shuffle=false}={}
   * @returns {Object} track
   */
  getNextTrack(
    { songs = this.songs, skip = 1, newCurrentTrack = true, sort = false } = {}
  ) {
    if (songs.length === 0) {
      throw { error: err.PLAYLIST_EMPTY };
    }

    let trackIndex = this.currentTrack + skip;
    let track = { looped: false, song: undefined };

    // Assume that negative value means the user does not want to cycle to the other end
    // NOTE: Perhaps add that as an option
    if (trackIndex < 1) {
      trackIndex = 1;
    }

    //This indicates that we have jumped over the end of the playlist
    if (trackIndex > songs.length) {
      trackIndex = (this.currentTrack + skip) % songs.length;
      track.looped = true;
    }

    songs = this.get({ sort, songs });

    this.currentTrack = newCurrentTrack ? trackIndex : this.currentTrack;
    track.song = songs[trackIndex - 1];
    return track;
  }
  /**
   * Ends the song currently playing.
   * @param  {Boolean} next=false
   */
  endCurrentSong(next = false) {
    this.songPlaying.autoNext = next; //Determines wether the song automatically goes to the next song on end
    this.songPlaying.dispatcher.end();
  }

  /**
   * returns a new shuffled list of songs
   * @param  {Object} songs=this.songs
   * @returns {SongList[]}
   */
  mix({ songs = this.songs } = {}) {
    let mixedList = [...songs];
    for (let i = mixedList.length; i >= 1; i--) {
      let rand = Math.floor(Math.random() * i);
      [mixedList[i - 1], mixedList[rand]] = [mixedList[rand], mixedList[i - 1]];
    }

    return mixedList;
  }

  /**
   * FIXME: Legacy code
   * returns a static shuffled version of the list, does not reshuffle the list like mix
   * @returns {SongList[]}
   */
  shuffle({ songs = this.songs } = {}) {
    return this.get({ sort: "shuffle", songs });
  }

  /**
   * returns a distinct version of the playlist
   * @param  {Object} songs=this.songs
   */
  distinct({ songs = this.songs } = {}) {
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
