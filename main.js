"use strict";
require("dotenv").config();
// require("./lib/db/db").init(); //Initialize the database
const express = require("express");
const app = express();
const http = require("http").Server(app);
const Grengill = require("./lib/grengill");
const grengilBot = new Grengill(process.env.BOT_TOKEN);
const socket = require("./lib/socket");
const plugins = require("./lib/plugins");

//TODO: Should probably finish up the unit testing but man am I lazy, this will do -- sorry future me.
const testRunner = require("./grengil_tests");
const TEST = process.env.TEST === "true";

socket(http, app, grengilBot);
plugins(grengilBot, app);

grengilBot.onReady(() => {
  console.log("GrengilBot ready");

  if (TEST) {
    testRunner(grengilBot);
  }
});

http.listen(process.env.PORT || 5000, () => {
  console.log("server is running"); //Listen on the port and log success
});

/* For crazy people
process.on("uncaughtException", err => {
  console.error(err.stack);
  console.log("Node not stopping.");
}); */
