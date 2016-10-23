const YouTube = require('youtube-api');

YouTube.authenticate({
  type: 'key',
  key: process.env.YOUTUBE_API_KEY
});

exports.getSearch = (params)=>{
  return new Promise((resolve, reject)=>{
    YouTube.search.list(params, (error, result)=>{
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
      }
    });
  });
};


exports.getVideoInfo = (videoIds)=>{
  return new Promise((resolve, reject)=>{

    var params = {
      id: videoIds.toString(),
      maxResults: 10,
      part: 'contentDetails'
    };

    YouTube.videos.list(params, (error, result)=>{
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
      }
    });
  });
};
