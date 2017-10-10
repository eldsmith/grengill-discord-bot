const { sortBy, isString, isArray, isFunction, get } = require("lodash");
const err = require("../lib/errors");
const sortUtil = require("../util/sortUtil");
const Song = require("./song");

class SongList {
  constructor(
    { songs = [], currentTrack = 1, Model = Song, repeatMode = false } = {}
  ) {
    this._songs = [];
    this._sortFunctions = {};
    this.songPlaying = { song: {}, playing: false, dispatcher: undefined }; // The current song playing
    this.currentTrack = currentTrack;
    this.repeatMode = false;

    songs.map(this.add.bind(this));

    this._addSort(["shuffle", "distinct"]);
  }

  /**
   * Adds a song to the playlist, with a random seed
   * @param  {Object} song
   */
  add(song) {
    /* FIXME: does not work currently
    by using currently playing song we ensure
		this song is after it in shufflemode
    if (this.songPlaying && this.shuffleMode) {
      baseSeed = this.songPlaying.shuffleSeed;
    }*/
    if (!(song instanceof Song)) {
      song = new Song({ song });
    }

    this._songs.push(song);
  }

  /**
   * Gets the playlist
   * @param  {function || string} {sort=false
   * @param  {Object[]} songs=this._songs}={}
   * @returns {Promise} that resolves with a list of songs
   */
  get({ sort = false, songs = this._songs } = {}) {
    return Promise.resolve(this._runSort(sort, songs));
  }

  /**
   * Gets the next track from the playlist based on params passed in
   * @param  {Object[]} {songs=this._songs
   * @param  {Int} skip=1
   * @param  {Boolean} newCurrentTrack=true
   * @param  {function} sort=false
   * @param  {Boolean} shuffle=false}={}
   * @returns {Object} track
   */
  getNextTrack(
    { songs = this._songs, skip = 1, newCurrentTrack = true, sort = false } = {}
  ) {
    if (songs.length === 0) {
      return Promise.reject({ error: err.PLAYLIST_EMPTY });
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

    return this.get({ sort, songs }).then(songsReturn => {
      this.currentTrack = newCurrentTrack ? trackIndex : this.currentTrack;
      track.song = songsReturn[trackIndex - 1];
      return track;
    });
  }
  /**
   * Ends the song currently playing.
   * @param  {Boolean} next=false
   */
  endCurrentSong() {
    this.songPlaying.dispatcher.end();
  }

  /**
   * returns a new shuffled list of songs
   * @param  {Object} songs=this._songs
   * @returns {SongList[]}
   */
  mix({ songs = this._songs } = {}) {
    let mixedList = [..._songs];
    for (let i = mixedList.length; i >= 1; i--) {
      let rand = Math.floor(Math.random() * i);
      [mixedList[i - 1], mixedList[rand]] = [mixedList[rand], mixedList[i - 1]];
    }

    return mixedList;
  }

  _addSort(sort) {
    if (isArray(sort)) {
      sort.map(s => {
        this._addSort(s);
      });
    } else if (isString(sort)) {
      this._sortFunctions[sort] = sortUtil[sort];
    } else if (isFunction(sort.sort) && sort.name) {
      this._sortFunctions[sort.name] = sort.sort;
    }
  }

  _removeSort(sort) {
    if (isArray(sort)) {
      sort.map(s => {
        this._removeSort(sort);
      });
    } else if (isString(sort)) {
      delete this._sortFunctions[sort];
    }
  }

  _runSort(sort, songs) {
    if (isArray(sort)) {
      // songs mutates on each iteration of get
      sort.map(s => {
        songs = this._runSort(s, songs);
      });
      return songs;
    } else if (isString(sort)) {
      let splitSort = sort.split("|");

      // There are many commands, so use recursion to go through them all
      if (splitSort.length > 1) {
        return this._runSort(splitSort, songs);
      }

      let sortFun = get(this._sortFunctions, splitSort[0].trim()); // lodash get; not recursion.
      if (sortFun) {
        return sortFun(songs);
      }
    } else if (isFunction(sort)) {
      return sort(songs);
    }
    return songs;
  }
}

module.exports = SongList;
