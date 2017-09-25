"use strict";

const EventEmitter = require("events");
const ytdl = require("ytdl-core");
const Discord = require("discord.js");
const songList = require("../models/song_list");
const sortBy = require("lodash").sortBy;
const err = require("./errors");

//FIXME: Catch alls, need to figure out which errors can be safely caught without leaving the app inconsistent.
class Grengill {
  constructor(botToken, consolePlaybackInfo = true, consoleErrors = true) {
    this.dispatcher = new EventEmitter();
    this.events = new EventEmitter();
    this.voiceConnection;
    this.client = new Discord.Client();

    this.playlist = new songList();
    this.shuffleMode = false;
    this.repeatMode = false;
    this.playing = false;
    this.currentTrack = 1;

    this.consolePlaybackInfo = consolePlaybackInfo;
    this.consoleErrors = consoleErrors;

    this.client.login(botToken);
  }

  clearPlaylist() {
    this.playlist = new songList();
  }

  play(song) {
    try {
      const stream = ytdl("https://www.youtube.com/watch?v=" + song.id, {
        filter: "audioonly"
      });
      const dispatcher = this.voiceConnection.playStream(stream);

      this.playlist.songPlaying = {
        song,
        playing: true,
        autoNext: true,
        dispatcher
      };
      this._logInfo("Song playing: " + song.title);

      // When this song ends we go to the next song if autoNext is true
      dispatcher.on("end", () => {
        this.playlist.songPlaying.playing = false;
        if (this.playing && this.playlist.songPlaying.autoNext) {
          this.playNext();
        }
      });
    } catch (e) {
      this._logError(e);
    }
  }

  shuffle() {
    this.shuffleMode = !this.shuffleMode;
  }

  repeat() {
    this.repeatMode = !this.repeatMode;
  }

  //FIXME: check for empty playlist, otherwise infinite loop it seems like...
  playNext(skip = 1) {
    let track;
    try {
      track = this.playlist.getNextTrack({
        skip,
        sort: this.shuffleMode ? "shuffle" : false
      });
    } catch (e) {
      if (e.error === err.PLAYLIST_EMPTY) {
        return { error: "Empty Playlist, can't play next." };
      }
    }

    //If we are at the end of the playlist
    if (track.looped) {
      this._logInfo("End of playlist reached.");
      this.playlist.currentTrack = 1; //reset playlist

      //If repeat we just keep going otherwise stop playback
      if (!this.repeatMode) {
        this.stopPlayback();
        return false; // nothing to play next.
      }
    }

    try {
      //If this method is run in the middle of playback it means we are skipping a song mid-play
      if (
        this.playlist.songPlaying.playing &&
        this.playlist.songPlaying.dispatcher
      ) {
        this.playlist.endCurrentSong(false);
      }
      this.play(track.song);
    } catch (e) {
      this._logError(e);
    }
  }

  startPlayback() {
    if (!this.voiceConnection) {
      console.log("Playback attempt without voice connection");
      return { error: "NoVoice" };
    }

    if (!this.playing) {
      this.playNext(0); // 0 so that it doesn't skip but starts at the current track
      this.playing = true;
    } else {
      this._logInfo("Playback attempt when playback has already started");
    }
  }

  stopPlayback() {
    if (this.playing) {
      this.playing = false;
      if (this.playlist.songPlaying.playing) {
        this.playlist.endCurrentSong();
      }
    } else {
      this._logInfo("Playback stop attempt when playback is already stopped");
    }
  }

  join(voiceChannel) {
    try {
      voiceChannel
        .join()
        .then(connection => (this.voiceConnection = connection));
      this._logInfo("Joining channel: " + voiceChannel.name);
    } catch (e) {
      this._logError(e);
    }
  }

  add(song) {
    //If adding an array of songs
    console.log();
    if (song.constructor === Array) {
      song.map(this.playlist.add);
      this._logInfo("Added " + song.length + " songs");
      this.events.emit("addMany", song);
    } else {
      this.playlist.add(song);
      this._logInfo("Adding song: " + song.title);
      this.events.emit("add", song);
    }
  }

  //shorthand method to access events
  on(name, call) {
    this.events.on(name, call);
  }

  //Client events
  onMessage(call) {
    this.client.on("message", call);
  }

  onReady(call) {
    this.client.on("ready", call);
  }

  //Logging methods
  _logInfo(message) {
    if (this.consolePlaybackInfo) {
      console.log(message);
    }
  }

  _logError(error) {
    if (this.consoleErrors) {
      console.log(error);
    }
  }
}

module.exports = Grengill;
