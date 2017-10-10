const { sortBy } = require("lodash");

module.exports = {
  shuffle: songs => {
    return sortBy(songs, ["shuffleSeed"]);
  },

  distinct: songs => {
    let found = [],
      ret = [];
    for (let i = 0; i < songs.length; i++) {
      let id = songs[i].getId();
      if (found.indexOf(id) === -1) {
        found.push(id);
        ret.push(songs[i]);
      }
    }

    return ret;
  }
};
