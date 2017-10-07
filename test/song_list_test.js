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

    it("goes from 1 to 2", done => {
      testList
        .getNextTrack({ skip: 1 })
        .then(({ song }) => {
          return assert(song.data.name === "2");
        })
        .then(done)
        .catch(done);
    });
    it("goes from 2 to 3", done => {
      testList
        .getNextTrack({ skip: 1 })
        .then(({ song }) => {
          return assert(song.data.name === "3");
        })
        .then(done)
        .catch(done);
    });
    it("goes from 3 to 1", done => {
      testList
        .getNextTrack({ skip: -2 })
        .then(({ song }) => {
          return assert(song.data.name === "1");
        })
        .then(done)
        .catch(done);
    });
    it("goes from 1 to 4", done => {
      testList
        .getNextTrack({ skip: 3 })
        .then(({ song }) => {
          return assert(song.data.name === "4");
        })
        .then(done)
        .catch(done);
    });
    it("tries to go less than 1 but still stay in 1", done => {
      testList
        .getNextTrack({ skip: -10 })
        .then(({ song }) => {
          return assert(song.data.name === "1");
        })
        .then(done)
        .catch(done);
    });
    it("loops to the beginning of the playlist and to 3", done => {
      testList
        .getNextTrack({ skip: 6 })
        .then(({ song }) => {
          return assert(song.data.name === "3");
        })
        .then(done)
        .catch(done);
    });
    it("loops and indicates that a loop occurred", done => {
      testList
        .getNextTrack({ skip: 6 })
        .then(data => {
          return assert(data.looped === true);
        })
        .then(done)
        .catch(done);
    });
    it("gets the next track in a shuffle", done => {
      let track, randTrack;
      testList
        .getNextTrack({ sort: "shuffle" })
        .then(({ song }) => {
          track = song;
          return testList.shuffle();
        })
        .then(shuffled => {
          randTrack = shuffled[testList.currentTrack - 1];
          assert(track.data.name == randTrack.data.name);
        })
        .then(done)
        .catch(done);
    });
    it("returns an error when nexting an empty playlist", done => {
      let emptyList = new SongList({ songs: [] });

      emptyList.getNextTrack().catch(e => {
        assert((e.error = err.PLAYLIST_EMPTY));
        done();
      });
    });
  });

  describe("Shuffle", function() {
    before(function() {
      testList = new SongList({ songs });
    });

    it("returns a properly shuffled playlist", function(done) {
      testList
        .shuffle()
        .then(shuffled => {
          assert(shuffleTest(shuffled) === true);
        })
        .then(done)
        .catch(done);
    });
    it("returns an unshuffled playlist", function(done) {
      testList
        .get()
        .then(songs => {
          assert(shuffleTest(songs) === false);
        })
        .then(done)
        .catch(done);
    });
    it("still has the same length as an unshuffled playlist", function(done) {
      testList
        .shuffle()
        .then(shuffled => {
          assert(shuffled.length === 4);
        })
        .then(done)
        .catch(done);
    });
  });

  describe("Adding", function() {
    before(function() {
      testList = new SongList();
    });

    it("adds a song to an empty playlist", function(done) {
      testList.add({ name: "bartholomew" });
      testList
        .get()
        .then(songs => {
          assert(songs.length === 1);
        })
        .then(done)
        .catch(done);
    });

    it("adds another song to the end", function(done) {
      testList.add({ name: "2" });
      testList
        .get()
        .then(songs => {
          assert(songs[1].data.name === "2");
        })
        .then(done)
        .catch(done);
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
        return [list[0]];
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

    it("sorts by alphabetical", function(done) {
      testList
        .get({ sort: alphaSort })
        .then(songs => {
          let prevSong;
          let worked = true;

          songs.map(song => {
            if (prevSong && song.name < prevSong.name) {
              worked = false;
            }
            prevSong = song;
          });

          assert(worked);
        })
        .then(done)
        .catch(done);
    });

    it("sorts by alphabetical and then gets first", function(done) {
      testList
        .get({ sort: [alphaSort, getFirst] })
        .then(songs => {
          assert(songs[0].data.name === "adam");
        })
        .then(done)
        .catch(done);
    });

    it("gets first two then sorts by alphabetical", function(done) {
      testList
        .get({ sort: [getFirstTwo, alphaSort] })
        .then(songs => {
          assert(
            songs[0].data.name === "adam" && songs[1].data.name === "zebra"
          );
        })
        .then(done)
        .catch(done);
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
