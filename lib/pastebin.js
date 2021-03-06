const PastebinAPI = require("pastebin-js");
const pastebin = new PastebinAPI(process.env.PASTEBIN_API_KEY);

/**
 * Creates a pastebin with the SongList
 * @param  {SongList[]} songs
 * @param {string} id
 * @return {Promise}
 */
module.exports.songLogger = function(songs, id) {
  let out = "";
  let title;

  console.log(songs);
  songs.map(song => {
    out += song.getTitle() + "\n";
  });
  console.log("im here");

  switch (id) {
    case "history":
      title = "GrengilBot History";
      break;
    case "playlist":
      title = "GrengilBot Playlist";
      break;
  }

  return createPaste(out, title);
};

function createPaste(text, title) {
  return pastebin.createPaste({
    text,
    title: title || "GrengilBot Song List",
    format: null,
    expiration: "10M"
  });
}
