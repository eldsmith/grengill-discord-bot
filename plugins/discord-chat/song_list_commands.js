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
  let flags = {};

  console.log(songs);
  commandsList.map(command => {
    switch (command) {
      case "shuffle":
      case "s":
        songs = songList.shuffled().songs;
        break;
      case "unique":
      case "u":
        songs = songList.distinct(songs);
        break;
      case "log":
      case "l":
        flags.log = true;
        break;
      case "add":
      case "a":
        flags.add = true;
        break;
      case "new":
      case "n":
        flags.new = true;
        break;
    }
  });

  if (flags.add) {
    grengilBot.add(songs);
  }
  if (flags.new) {
    grengilBot.clearPlaylist();
    grengilBot.add(songs);
  }
  if (flags.log) {
    logger(songs, id)
      .then(data => {
        message.channel.sendMessage("Somebody asked me for this shit: " + data);
      })
      .fail(err => {
        console.log(err);
        message.channel.sendMessage(
          "Oh shit, I messed up, go away I ain't got time for this shit"
        );
      });
  }
};
