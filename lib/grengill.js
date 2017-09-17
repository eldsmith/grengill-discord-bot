"use strict";

const EventEmitter = require("events");
const ytdl = require("ytdl-core");
const Discord = require("discord.js");
const songList = require("../models/song_list");
const sortBy = require("lodash").sortBy;

class Grengill {
  constructor(botToken, consolePlaybackInfo = true, consoleErrors = true) {
    this.dispatcher = new EventEmitter();
    this.events = new EventEmitter();
    this.voiceConnection;
    this.client = new Discord.Client();

    this.playlist = new songList();
    this.shuffleMode = false;
    this.playing = false;
    this.currentTrack = 0;

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

      this.playlist.songPlaying = { song, playing: true, dispatcher };
      this._logInfo("Song playing: " + song.title);
      return dispatcher;
    } catch (e) {
      this._logError(e);
    }
  }

  shuffle() {
    this.shuffleMode = !this.shuffleMode;
  }

  // Inconsistent returns, can only return dispatcher if another song is not playing.
  playNext() {
    if (this.currentTrack >= this.playlist.songs.length) {
      this._logInfo("No more songs to play.");
      return false; // There is nothing to play
    }

    try {
      //If this method is run in the middle of playback it means we are skipping a song mid-play
      if (
        this.playlist.songPlaying.playing &&
        this.playlist.songPlaying.dispatcher
      ) {
        this.playlist.songPlaying.dispatcher.end(); //When dispatcher ends in playback, it automatically goes to the next song
      } else {
        this.currentTrack++;
        let song;
        if (this.shuffleMode) {
          song = this.playlist.shuffled()[this.currentTrack - 1];
        } else {
          song = this.playlist.songs[this.currentTrack - 1];
        }
        return this.play(song);
      }
    } catch (e) {
      this._logError(e);
    }
  }

  startPlayback() {
    if (!this.playing) {
      this.playback(this.playNext());
      this.playing = true;
    } else {
      this._logInfo("Playback attempt when playback has already started");
    }
  }

  stopPlayback() {
    if (this.playing) {
      this.playing = false;
      this.playlist.songPlaying.dispatcher.end();
    } else {
      this._logInfo("Playback stop attempt when playback is already stopped");
    }
  }

  playback(dispatcher) {
    if (dispatcher) {
      dispatcher.on("end", () => {
        this.playlist.songPlaying.playing = false;
        if (this.playing) this.playback(this.playNext());
      });
    } else {
      this.stopPlayback();
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
