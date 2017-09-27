class Song {
  constructor({ song = {}, baseSeed = 0 } = {}) {
    Object.assign(this, song);
    this.shuffleSeed = Math.random(baseSeed, 10);
  }
}

module.exports = Song;
