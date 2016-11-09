"use strict";
require('dotenv').config();
require('./lib/db/db').init(); //Initialize the database

var app = require('express')();
var http = require('http').Server(app);
const Grengill = require('./lib/grengill');
const grengilBot = new Grengill(process.env.BOT_TOKEN);

require('./lib/socket')(http, app, grengilBot);
/*Require every app.js within subdirectories of modules and pass bot through*/
var normalizedPath = require('path').join(__dirname, 'plugins');

try{
  require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require('./plugins/' + file +'/app')(grengilBot);
  });
}
catch(error){
  console.log('Error requiring module:');
  console.error(error);
}

grengilBot.onReady(()=>{
  console.log('GrengilBot ready');
});

/*FIXME:This should only catch ERRCONNECT, for now catches everything*/
process.on('uncaughtException', (err)=>{
  console.error(err.stack);
  console.log("Node not stopping.");
});
