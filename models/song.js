class Song {
  constructor({ song = {}, baseSeed = 0, songPlaying = false } = {}) {
    this.data = song;
    this.dispatcher = undefined;
    this.songPlaying = songPlaying;
    this.shuffleSeed = Math.random(baseSeed, 10);
  }

  setDispatcher(dispatcher) {
    this.dispatcher = dispatcher;
  }

  getTitle() {
    return this.data.name;
  }

  getId() {
    return this.data.id;
  }
}

module.exports = Song;
