"use strict";
require('dotenv').config();
const Grengill = require('./lib/grengill');
const grengilBot = new Grengill(process.env.BOT_TOKEN);

/*Require every app.js within subdirectories of modules and pass bot through*/
var normalizedPath = require("path").join(__dirname, "plugins");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require('./plugins/' + file +'/app')(grengilBot);
});

grengilBot.on('ready', ()=>{
  console.log('GrengilBot ready');
});

/*FIXME:This should only catch ERRCONNECT, for now catches everything*/
process.on('uncaughtException', (err)=>{
  console.error(err.stack);
  console.log("Node not stopping.");
});
