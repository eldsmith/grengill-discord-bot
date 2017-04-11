var express = require('express');

var app = express();

app.set('view engine', 'pug'); //Sets the templating engine
app.set('views', __dirname + '/../public/views'); //Sets the views directory

//Sets up a middleware that serves static pages from public
app.use(express.static(__dirname + '/../public'));

require('./routes.js')(app); //passes in app to set up the routes

module.exports = app;
