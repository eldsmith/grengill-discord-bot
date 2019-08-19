"use strict";

//const config = require(process.cwd() + '/lib/config').config(__dirname);
const LokiDatabase = require(process.cwd() + "/lib/db/db");
// const db = new LokiDatabase({
//   defaultCollections: ["songs", "playlists", "history"]
// });
const commandController = require("./command_controller");

let grengilBot;

//TODO: Rethink this approach --perhaps some improvements or redesign of grengill.js
module.exports = grengilBotIn => {
  grengilBot = grengilBotIn;

  //FIXME: Not a great place for this.
  //FIXME: History collection should have ttl or some sort of limit

  // grengilBot.on("add", song => {
  //   song.dateAdded = Date();
  //   db.addToCollection({ collection: "history", data: song });
  // });

  grengilBot.onMessage(commandController(grengilBot));
};
