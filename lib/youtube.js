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

exports.getVideo = (videoId)=>{
  return this.getVideoInfo(videoId, {part : 'snippet'});
};

exports.getVideoInfo = (videoIds, {maxResults = 1, part = 'contentDetails', type = 'video'} = {})=>{
  return new Promise((resolve, reject)=>{

    var params = {
      id: videoIds.toString(),
      maxResults,
      part,
      type
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
