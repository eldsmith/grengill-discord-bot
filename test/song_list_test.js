const SongList = require("../models/song_list");
const assert = require("assert");

songs = [{ name: "1" }, { name: "2" }, { name: "3" }, { name: "4" }];

const testList = new SongList({ songs });

describe("SongList test", function() {
  describe("Skipping", function() {
    it("should go from first track to second", () => {
      let { song } = testList.getNextTrack({ skip: 1 });
      console.log(song);
      assert(song.name === "2");
    });
  });
});
