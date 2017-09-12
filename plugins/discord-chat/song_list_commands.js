"use strict";

const SongList = require("../../models/song_list");
const logger = require("../../lib/pastebin.js").songLogger; //TODO: Should be defined by conf file

module.exports = (songList, commandInput, grengilBot, message) => {
  let commands;

  // commands should be an array of strings
  if (typeof commandInput === "string") {
    commands = commandInput.split(" ");
  } else {
    commands = commandInput;
  }

  if (!commands) return;

  let songs = [...songList.songs];
  let addSongsFlag = false;
  let newSongsFlag = false;

  console.log(songs);
  commands.map(command => {
    switch (command) {
      case "shuffle":
      case "s":
        songs = songList.mix(songs);
        break;
      case "unique":
      case "u":
        songs = songList.distinct(songs);
        break;
      case "log":
      case "l":
        logger(songs)
          .then(data => {
            message.channel.sendMessage(
              "Somebody asked me for this shit: " + data
            );
          })
          .fail(err => {
            console.log(err);
            message.channel.sendMessage(
              "Oh shit, I messed up, go away I ain't got time for this shit"
            );
          });
        break;
      case "add":
      case "a":
        addSongsFlag = true;
        break;
      case "new":
      case "n":
        newSongsFlag = true;
        break;
    }

    if (addSongsFlag) {
      grengilBot.add(songs);
    }
    if (newSongsFlag) {
      grengilBot.clearPlaylist();
      grengilBot.add(songs);
    }
  });
};
