const SongList = require("../models/song_list");
const assert = require("assert");
const err = require("../lib/errors");

const songs = [{ name: "1" }, { name: "2" }, { name: "3" }, { name: "4" }];

describe("SongList test", function() {
  let testList;
  describe("getNextTrack", function() {
    before(function() {
      testList = new SongList({ songs });
    });

    it("goes from 1 to 2", () => {
      let { song } = testList.getNextTrack({ skip: 1 });
      assert(song.data.name === "2");
    });
    it("goes from 2 to 3", () => {
      let { song } = testList.getNextTrack({ skip: 1 });
      assert(song.data.name === "3");
    });
    it("goes from 3 to 1", () => {
      let { song } = testList.getNextTrack({ skip: -2 });
      assert(song.data.name === "1");
    });
    it("goes from 1 to 4", () => {
      let { song } = testList.getNextTrack({ skip: 3 });
      assert(song.data.name === "4");
    });
    it("tries to go less than 1 but still stay in 1", () => {
      let { song } = testList.getNextTrack({ skip: -10 });
      assert(song.data.name === "1");
    });
    it("loops to the beginning of the playlist and to 3", () => {
      let { song } = testList.getNextTrack({ skip: 6 });
      assert(song.data.name === "3");
    });
    it("loops and indicates that a loop occurred", () => {
      let track = testList.getNextTrack({ skip: 6 });
      assert(track.looped === true);
    });
    it("gets the next track in a shuffle", () => {
      let track = testList.getNextTrack({ sort: "shuffle" }).song.name;
      let randTrack = testList.shuffle()[testList.currentTrack - 1].name;

      assert(track == randTrack);
    });
    it("returns an error when nexting an empty playlist", () => {
      let emptyList = new SongList({ songs: [] });

      try {
        emptyList.getNextTrack();
      } catch (e) {
        assert((e.error = err.PLAYLIST_EMPTY));
      }
    });
  });

  describe("Shuffle", function() {
    before(function() {
      testList = new SongList({ songs });
    });

    it("returns a properly shuffled playlist", function() {
      let shuffled = testList.shuffle();
      assert(shuffleTest(shuffled) === true);
    });
    it("returns an unshuffled playlist", function() {
      let unshuffled = testList.get();
      assert(shuffleTest(unshuffled) === false);
    });
    it("still has the same length as an unshuffled playlist", function() {
      let shuffled = testList.shuffle();
      assert(shuffled.length === 4);
    });
  });

  describe("Adding", function() {
    before(function() {
      testList = new SongList();
    });

    it("adds a song to an empty playlist", function() {
      testList.add({ name: "bartholomew" });
      assert(testList.get().length === 1);
    });

    it("adds another song to the end", function() {
      testList.add({ name: "2" });
      assert(testList.get()[1].data.name === "2");
    });
  });

  describe("Getting & sorting", function() {
    let alphaSort, getFirst;

    before(function() {
      alphaSort = list => {
        return list.sort((a, b) => {
          return a.data.name > b.data.name;
        });
      };

      getFirst = list => {
        return list[0];
      };

      getFirstTwo = list => {
        return list.slice(0, 2);
      };
    });

    beforeEach(function() {
      testList = new SongList({
        songs: [{ name: "adam" }, { name: "zebra" }, { name: "bard" }]
      });
    });

    it("sorts by alphabetical", function() {
      let songList = testList.get({ sort: alphaSort });
      let prevSong;
      let worked = true;

      songList.map(song => {
        if (prevSong && song.name < prevSong.name) {
          worked = false;
        }
        prevSong = song;
      });

      assert(worked);
    });

    it("sorts by alphabetical and then gets first", function() {
      let songList = testList.get({ sort: [alphaSort, getFirst] });
      assert(songList.data.name === "adam");
    });

    it("gets first two then sorts by alphabetical", function() {
      let songList = testList.get({ sort: [getFirstTwo, alphaSort] });
      assert(
        songList[0].data.name === "adam" && songList[1].data.name === "zebra"
      );
    });
  });
});

function shuffleTest(songs) {
  let shuffleWorked = true;
  let prev = 0;

  songs.map(song => {
    if (song.shuffleSeed < prev) {
      shuffleWorked = false;
    }
    prev = song.shuffleSeed;
  });

  return shuffleWorked;
}
