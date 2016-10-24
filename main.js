"use strict";
require('dotenv').config();
const Grengill = require('./lib/grengill');
const grengilBot = new Grengill(process.env.BOT_TOKEN);
require('./services/discordChat/discordChat')(grengilBot);

grengilBot.on('ready', ()=>{
  console.log('GrengilBot ready');
});

process.on('uncaughtException', function (err) {
  console.error(err.stack);
  console.log("Node NOT Exiting...");
});
