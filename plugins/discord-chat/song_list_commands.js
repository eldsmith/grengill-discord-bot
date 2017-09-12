"use strict";

const SongList = require("../../models/song_list");

const PastebinAPI = require("pastebin-js");
const pastebin = new PastebinAPI(process.env.PASTEBIN_API_KEY);

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
        //TODO: Add a logger function that can be replaced easy
        let logOutput = "";
        for (let song of songs) {
          logOutput += song.title + "\n";
        }
        pastebin
          .createPaste({
            text: logOutput,
            title: "GrengilBot Playlist",
            format: null,
            expiration: "10M"
          })
          .then(function(data) {
            message.channel.sendMessage(data);
          })
          .fail(function(err) {
            console.log(err);
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
