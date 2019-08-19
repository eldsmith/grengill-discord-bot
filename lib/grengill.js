"use strict";

const EventEmitter = require("events");
const Discord = require("discord.js");
const songList = require("../models/song_list");
const sortBy = require("lodash").sortBy;
const err = require("./errors");
var stream = require('stream');

const songModels = {
  youtube: require("../models/youtube_song"),
  song: require("../models/song")
};

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

  shuffle() {
    this.shuffleMode = !this.shuffleMode;
  }

  repeat() {
    this.repeatMode = !this.repeatMode;
    this.playlist.repeatMode = this.repeatMode;
  }

  play(song) {
    console.log('hey');
    let dispatcher = this.voiceConnection.playStream(song.getStream());
    console.log('hey hey hey');

    song.setDispatcher(dispatcher);
    song.playing = true;
    this.playing = true;

    this.playlist.songPlaying = song;

    // When this song ends we go to the next song if we are playing
    dispatcher.on("end", () => {
      this.playlist.songPlaying.playing = false;
      if (this.playing) {
        this.playNext();
      }
    });
  }

  //FIXME: check for empty playlist, otherwise infinite loop it seems like...
  playNext(skip = 1) {
    console.log('here');
    this.playlist
      .getNextTrack({
        skip,
        sort: this.shuffleMode ? "shuffle" : false
      })
      .then(track => {
        //If we are at the end of the playlist
        if (track.looped) {
          this._logInfo("End of playlist reached.");

          //If repeat we just keep going otherwise stop playback
          if (!this.repeatMode) {
            this.stopPlayback();
            return false; // nothing to play next.
          } else {
            this.playlist.currentTrack = 1; //reset playlist
          }
        }

        //If this method is run in the middle of playback it means we are skipping a song mid-play
        if (
          this.playlist.songPlaying.playing &&
          this.playlist.songPlaying.dispatcher
        ) {
          this.playing = false;
          this.playlist.endCurrentSong();
        }
        this.play(track.song);
      })
      .catch(error => {
        console.log(error);
        return error;
      });
  }

  startPlayback() {
    if (!this.voiceConnection) {
      console.log("Playback attempt without voice connection");
      return { error: "NoVoice" };
    }

    if (!this.playing) {
      this.playNext(0); // 0 so that it doesn't skip but starts at the current track
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
    this._logInfo("Joining voice channel: " + voiceChannel.name);
    return voiceChannel
      .join()
      .then(connection => (this.voiceConnection = connection))
      .catch(error => {
        this._logError("Failed joining voice channel: "  + error.message)
        return Promise.reject(error);
      });
  }

  add({ song, provider }) {
    //If adding an array of songs
    let SongModel = songModels[provider];
    if (song.constructor === Array) {
      let newSongArray = [];
      song.map(s => {
        let newSong = new SongModel({ song });
        this.playlist.add(newSong);
        newSongArray.push(newSong);
      });

      this._logInfo("Added " + song.length + " songs");
      this.events.emit("addMany", newSongArray); // FIXME? Why am I doing this? why not just multiple add events?
    } else {
      let newSong = new SongModel({ song });
      this.playlist.add(newSong);

      this._logInfo("Adding song: " + newSong.getTitle());
      this.events.emit("add", newSong);
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
