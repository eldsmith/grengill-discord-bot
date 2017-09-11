"use strict";

const SongList = require("../../models/song_list");

module.exports = (songList, commandInput, grengilBot, message) => {
  let commands;

  console.log(typeof commandInput);
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
        for (let song of songs.slice(0, 5)) {
          message.channel.sendMessage(song.title);
        }
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
