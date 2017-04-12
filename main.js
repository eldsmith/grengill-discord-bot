"use strict";
require('dotenv').config();
require('./lib/db/db').init(); //Initialize the database
var express = require('express')
var app = express();


/*previous server.js*/
app.set('view engine', 'pug'); //Sets the templating engine
app.set('views', './plugins/grengill-web/public/views'); //Sets the views directory

//Sets up a middleware that serves static pages from public
app.use(express.static('./plugins/grengill-web/public'));

require('./plugins/grengill-web/app/routes.js')(app); //passes in app to set up the routes

/**/

app.locals.env = process.env; // Make .env accessible to views

app.set('port', (process.env.PORT || 5000)); //Set the port to either the .env variable or 5000
// app.set('port', 5000); //Set the port to either the .env variable or 5000



var http = require('http').Server(app);
const Grengill = require('./lib/grengill');
const grengilBot = new Grengill(process.env.BOT_TOKEN);

require('./lib/socket')(http, app, grengilBot);
/*Require every app.js within subdirectories of modules and pass bot through*/
var normalizedPath = require('path').join(__dirname, 'plugins');

try{
  require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require('./plugins/' + file +'/app')(grengilBot, http);
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
