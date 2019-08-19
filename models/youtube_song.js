const Song = require("./song");
const ytdl = require("ytdl-core");

class YouTubeSong extends Song {
  constructor({ song = {}, baseSeed = 0, url } = {}) {
    super({ song, baseSeed });
  }

  getStream() {
    let yStream = ytdl("https://www.youtube.com/watch?v=" + this.data.id, {
      filter: "audioonly"
    });
    return yStream;
  }

  getTitle() {
    return this.data.title;
  }

  getId() {
    return this.data.id; //The same as Song, but keeping it here as that method is meant to be overridden
  }
}

module.exports = YouTubeSong;
