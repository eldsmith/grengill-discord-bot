const youtube = require('../lib/youtube');

/* {
 extendedInfo: provides additional info that requires a second ajax request
}*/
module.exports.search = (q, {maxResults = 1, extendedInfo = false} = {}) => {
  let params = {
    q: q,
    type: 'video',
    maxResults: maxResults,
    part: 'snippet'
  };


  return youtube.getSearch(params)
  .then((results) => {
    return new Promise((resolve, reject)=>{
      let songs = [];
      let videoIds = [];

      results.items.map((song)=>{
        songs.push({
          id: song.id.videoId,
          title: song.snippet.title
        });

        videoIds.push(song.id.videoId);
      });

      if(extendedInfo){
        youtube.getVideoInfo(videoIds, {maxResults}).then((secondResults) =>{
          songs = songs.map((song)=>{

            secondResults.items.map((info)=>{
              if(song.id === info.id){
                song.contentDetails = info.contentDetails;
              }
            });

            return song;
          });

          if(maxResults === 1){
            resolve(songs[0]);
          }
          resolve(songs);

        });
      }

      else{
        if(maxResults === 1){
          resolve(songs[0]);
        }
        resolve(songs);
      }

    });
  });
};
