const PastebinAPI = require("pastebin-js");
const pastebin = new PastebinAPI(process.env.PASTEBIN_API_KEY);

/**
 * Creates a pastebin with the SongList
 * @param  {SongList[]} songs
 * @return {Promise}
 */
module.exports.songLogger = function(songs) {
  let out = "";

  songs.map(song => {
    out += song.title + "\n";
  });

  return createPaste(out);
};

function createPaste(text, title) {
  return pastebin.createPaste({
    text,
    title: title || "GrengilBot Playlist",
    format: null,
    expiration: "10M"
  });
}
