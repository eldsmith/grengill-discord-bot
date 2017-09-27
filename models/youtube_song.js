const Song = require("./song");

class YouTubeSong extends Song {
  constructor({ song = {}, url } = {}) {
    super({ song });
  }

  add() {}
}

module.exports = YouTubeSong;
