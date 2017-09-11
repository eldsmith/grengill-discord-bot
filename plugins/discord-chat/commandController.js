"use strict";
const songListCommands = require("./song_list_commands");
const Youtube = require(process.cwd() + "/controllers/youtube_controller");
const HistorySongList = require(process.cwd() + "/models/history_song_list");
const historyList = new HistorySongList();

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
          grengilBot.join(message.member.voiceChannel);
          message.channel.sendMessage(
            "Joining voice channel: " + message.member.voiceChannel.name
          );
        } else {
          message.channel.sendMessage(
            "Hey, you need to first join a voice channel before you ask me to join...idiot."
          );
        }
        break;

      case "!play":
        grengilBot.startPlayback();
        break;

      case "!add":
        Youtube.search(extra).then(result => {
          grengilBot.add(result);
          message.channel.sendMessage("Added: " + result.title);
        });
        break;

      case "!next":
        if (grengilBot.playing) {
          grengilBot.playNext();
          message.channel.sendMessage("Yeah I hate that song too, skipping.");
        }
        break;

      case "!stop":
        grengilBot.stopPlayback();
        break;

      case "!playlist":
        songListCommands(grengilBot.playlist, extra, grengilBot, message);
        break;

      //FIXME: Doesn't check for dupes in playlist
      case "!history":
        songListCommands(historyList, extra, grengilBot, message);
        break;

      case "!shuffle":
        songListCommands(
          grengilBot.playlist,
          ["shuffle", "new", ...extra],
          grengilBot,
          message
        );
        break;
    }
  };
};
