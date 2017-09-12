"use strict";

const SongList = require("../../models/song_list");
const logger = require("../../lib/pastebin.js").songLogger; //TODO: Should be defined by conf file

module.exports = ({ songList, commands, grengilBot, message, id }) => {
  let commandsList;

  // commandsList should be an array of strings
  if (typeof commands === "string") {
    commandsList = commands.split(" ");
  } else {
    commandsList = commands;
  }

  if (!commandsList) return;

  let songs = [...songList.songs];
  let addSongsFlag = false;
  let newSongsFlag = false;

  console.log(songs);
  commandsList.map(command => {
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
        logger(songs, id)
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
