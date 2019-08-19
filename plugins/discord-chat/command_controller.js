"use strict";
const songListCommands = require("./song_list_commands");
const Youtube = require(process.cwd() + "/controllers/youtube_controller");
// const HistorySongList = require(process.cwd() + "/models/history_song_list");
// const historyList = new HistorySongList();

//FIXME: no proper returns, bad for testing
module.exports = grengilBot => {
  return message => {
    let chatString = message.content;
    let command = chatString.split(" ")[0]; //The command at the beginning of the string
    let extra = chatString.substring(command.length, chatString.length).trim(); //Everything after the command

    //FIXME: Error handling
    switch (command) {
      //Joins the voice channel of the person asking
      case "!join":
        if (message.member.voiceChannel) {
          grengilBot.join(message.member.voiceChannel)
            .then(() => {
              message.channel.sendMessage(
                "Joining voice channel: " + message.member.voiceChannel.name
              );
            })
            .catch(error => {
              let errorMessage = "Whoops, something went wrong joining the channel. An admin should probably look into this..."
              if (error.message === "FFMPEG not found"){
                errorMessage = "Hmmm, can't join because it looks like I don't have FFMPEG installed on my server, whoopsie..."
              }
              message.channel.send(errorMessage);
            });
        } else {
          message.channel.sendMessage(
            "Hey, you need to first join a voice channel before you ask me to join...idiot."
          );
        }
        break;

      case "!play":
        console.log('playyy');
        grengilBot.startPlayback();
        break;

      case "!add":
        Youtube.search(extra).then(result => {
          grengilBot.add({ song: result, provider: "youtube" });
          message.channel.sendMessage("Added: " + result.title);
        });
        break;

      case "!next":
        if (grengilBot.playing) {
          grengilBot.playNext();
          message.channel.sendMessage("Yeah I hate that song too, skipping.");
        }
        break;

      case "!prev":
        if (grengilBot.playing) {
          grengilBot.playNext(-1);
          message.channel.sendMessage(
            "I want you to listen to that horrible song again. Here you go."
          );
        }
        break;

      case "!stop":
        grengilBot.stopPlayback();
        break;

      case "!playlist":
        songListCommands({
          songList: grengilBot.playlist,
          commands: extra,
          grengilBot,
          message,
          id: "playlist"
        });
        break;

      //FIXME: Doesn't check for dupes in playlist
      case "!history":
        songListCommands({
          songList: historyList,
          commands: extra,
          grengilBot,
          message,
          id: "history"
        });
        break;

      case "!shuffle":
        grengilBot.shuffle();
        if (grengilBot.shuffleMode) {
          message.channel.sendMessage("Shuffle it up, bay-beh!");
        } else {
          message.channel.sendMessage("Shutting the shuffle down");
        }
        break;

      case "!repeat":
        grengilBot.repeat();
        if (grengilBot.repeatMode) {
          message.channel.sendMessage(
            "Let's listen to this shit over and over because we hate ourselves."
          );
        } else {
          message.channel.sendMessage(
            "Yes, We are free from the eternal loop of music!"
          );
        }
        break;
    }
  };
};
