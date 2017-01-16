const youtube = require('../lib/youtube');

module.exports.search = (q) => {
  let params = {
    q: q,
    type: 'video',
    maxResults: 1,
    part: 'snippet'
  };


  return youtube.getSearch(params)
  .then((results) => {
    return new Promise((resolve, reject)=>{
      //return only the id and title of the first (and only) result
      let result = {
        id: results.items[0].id.videoId,
        title: results.items[0].snippet.title
      };

      resolve(result);
    });
  });
}
