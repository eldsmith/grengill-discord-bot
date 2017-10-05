"use strict";
const assert = require("assert");
require("dotenv").config();
const express = require("express");

/*
const app = express();
const http = require("http").Server(app);
const Grengill = require("../lib/grengill");
const grengilBot = new Grengill(process.env.BOT_TOKEN);
const socket = require("../lib/socket");
const plugins = require("../lib/plugins");

socket(http, app, grengilBot);
plugins(grengilBot, app);

grengilBot.onReady(() => {
  console.log("GrengilBot ready");
  grengilBot.client.channels.map(channel => {
    if (channel.type === "voice" && channel.name === "General") {
      grengilBot.join(channel);
    }
  });
});

//require('../plugins/discord-chat/app')(grengilBot); //set everything up
const commandController = require("../plugins/discord-chat/command_controller")(
  grengilBot
);

describe("Command controller test", function() {
  describe("history", function() {
    it("should return -1 when the value is not present", function(done) {});
  });
});
*/
