const youtubeModel = require('../models/youtube');
const moment = require('moment');
require('moment-duration-format');

exports.search = (req, res)=>{

  let params = {
    q: req.query.search,
    type: 'video',
    maxResults: 10,
    part: 'snippet'
  };

  if(req.query.pageToken){
    params.pageToken = req.query.pageToken;
  }

  let searchResults;
  youtubeModel.getSearch(params)
  .then((results) => {
    searchResults = results;
    //Find all the videoIds in the search results
    let videoIds = searchResults.items.map((video)=>{
      return video.id.videoId;
    });

    //Get more info for those videos so I can get video duration
    return youtubeModel.getVideoInfo(videoIds);
  })
  .then((videoInfo)=>{
    //Map the durations of each video to it's corresponding search result
    searchResults.items = searchResults.items.map((item)=>{

      videoInfo.items.map((info)=>{
        if(item.id.videoId === info.id){
          item.snippet.duration = moment.duration(info.contentDetails.duration).format('hh:mm:ss');
        }
      });

      return item;
    });

    searchResults.prevSearch = req.query.search;
    //Render the view with the final results
    res.render('index', searchResults);
  });
};
