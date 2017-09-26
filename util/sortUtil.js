const { sortBy } = require("lodash");

module.exports = {
  shuffle: songs => {
    return sortBy(songs, ["shuffleSeed"]);
  }
};
