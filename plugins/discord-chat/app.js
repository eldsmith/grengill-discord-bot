'use strict';
const Youtube = require(process.cwd() + '/controllers/youtube_controller');
//const config = require(process.cwd() + '/lib/config').config(__dirname);
const db = require(process.cwd() + '/lib/db/db');
const HistorySongList = require(process.cwd() + '/models/history_song_list');
const songListCommands = require('./song_list_commands');

var historyList = new HistorySongList();
var grengilBot;

//TODO: Rethink this approach --perhaps some improvements or redesign of grengill.js
module.exports = (grengilBotIn)=>{
  grengilBot = grengilBotIn;

  //FIXME: Not a great place for this.
  //FIXME: History collection should have ttl or some sort of limit
  grengilBot.on('add', (song)=>{
    song.dateAdded = Date();
    db.addToCollection('history', song);
  });

  grengilBot.onMessage((message)=>{
    let chatString = message.content;
    let command = chatString.split(' ')[0]; //The command at the beginning of the string
    let extra = chatString.substring(command.length, chatString.length).trim(); //Everything after the command

    //FIXME: Error handling
    switch(command){

      //FIXME: Catch error if no channel
      case '!join':
        grengilBot.join(message.member.voiceChannel);
        message.channel.sendMessage('Joining voice channel: ' + message.member.voiceChannel.name);
        break;

      case '!play':
        grengilBot.startPlayback();
        break;

      case '!add':
        Youtube.search(extra).then((result)=>{
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

      //FIXME: Doesn't check for dupes in playlist
      case '!history':
        songListCommands(historyList, extra, grengilBot);
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
