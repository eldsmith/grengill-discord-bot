'use strict';
const youtube = require('./youtube.js');
const config = require(process.cwd() + '/lib/config').config(__dirname);
const db = require(process.cwd() + '/lib/db/db');
var grengilBot;

module.exports = (grengilBotIn)=>{
  grengilBot = grengilBotIn;

  //FIXME: Not a good place for this.
  //FIXME: History collection should have ttl or some sort of limit
  //TODO: There should be a history model or something.
  grengilBot.on('add', (song)=>{
    db.addToCollection('history', song);
  });

  grengilBot.onMessage((message)=>{
    let chatString = message.content;
    let command = chatString.split(' ')[0]; //The command at the beginning of the string
    let extra = chatString.substring(command.length, chatString.length).trim(); //Everything after the command

    switch(command){
      case '!join':
        grengilBot.join(message.member.voiceChannel);
        message.channel.sendMessage('Joining voice channel: ' + message.member.voiceChannel.name);
        break;

      case '!play':
        grengilBot.startPlayback();
        break;

      case '!add':
        search(extra).then((result)=>{
          grengilBot.add(result);
          message.channel.sendMessage('Added: ' + result.title);
        });
        break;

      case '!next':
        if(grengilBot.playing){
          grengilBot.playNext();
          message.channel.sendMessage('Yeah I hate that song too, skipping.');
        }
        break;

      case '!stop':
        grengilBot.stopPlayback();
        break;

      case '!playlist':
        for(let song of grengilBot.playlist.slice(0,5)){
          message.channel.sendMessage(song.title);
        }
        break;

      case '!history':
        history(extra);
        break;
    }
  });

};

//FIXME: Should probably have some sort of util.js for this stuff
function shuffle(a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
}

//FIXME: MODEL IS NEEDED
//FIXME: Doesn't check for dupes in playlist
function history(params){
  if(params=="mix"){
    let songHistory = db.distinct(db.getCollection('history').find(), 'id');
    shuffle(songHistory);
    grengilBot.add(songHistory);
  }
}


function search(q){
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
