const youtube = require('../lib/youtube');

/* {
 extendedInfo: provides additional info that requires a second ajax request
}*/
module.exports.search = (q, options = {maxResults: 1, extendedInfo: false}) => {
  let params = {
    q: q,
    type: 'video',
    maxResults: options.maxResults,
    part: 'snippet'
  };


  return youtube.getSearch(params)
  .then((results) => {
    return new Promise((resolve, reject)=>{
      let songs = [];

      results.items.map((song)=>{
        songs.push({
          id: song.id.videoId,
          title: song.snippet.title
        });
      });

      if(options.maxResults === 1){
        resolve(songs[0]);
      }
      resolve(songs);
    });
  });
};
