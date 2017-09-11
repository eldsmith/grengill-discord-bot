"use strict";
require("dotenv").config();
require("./lib/db/db").init(); //Initialize the database
const express = require("express");
const app = express();
const http = require("http").Server(app);
const Grengill = require("./lib/grengill");
const grengilBot = new Grengill(process.env.BOT_TOKEN);
const socket = require("./lib/socket");
const plugins = require("./lib/plugins");

socket(http, app, grengilBot);
plugins(grengilBot, app);

grengilBot.onReady(() => {
  console.log("GrengilBot ready");
});

http.listen(process.env.PORT || 5000, () => {
  console.log("server is running"); //Listen on the port and log success
});

/*FIXME:This should only catch ERRCONNECT, for now catches everything*/
process.on("uncaughtException", err => {
  console.error(err.stack);
  console.log("Node not stopping.");
});
