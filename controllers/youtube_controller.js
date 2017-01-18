const youtube = require('../lib/youtube');

/* {
 extendedInfo: provides additional info that requires a second ajax request
}*/
exports.search = (q, {maxResults = 1, pageToken = false, type = 'video', part = 'snippet'} = {}) => {
  let params = {q, type, maxResults, part};
  if(pageToken){
    params.pageToken = pageToken;
  }

  return youtube.getSearch(params)
  .then((results) => {
    return new Promise((resolve, reject)=>{
      let songs = [];

      results.items.map((song)=>{
        songs.push(convertToGrengilSong(song));
      });

      if(maxResults === 1){
        resolve(songs[0]);
      }
      resolve(songs);

    });
  });
};

exports.convertToGrengilSong = convertToGrengilSong;

// A standard way to convert to a song object used by grengil
function convertToGrengilSong(song){
  return {
    id: song.id.videoId,
    title: song.snippet.title,
    description: song.snippet.description,
    thumbnails: song.snippet.thumbnails
  };
}
