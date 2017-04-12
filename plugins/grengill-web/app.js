require('dotenv').config();
const express = require('express');

module.exports = (grengilBot, app) => {
	app.set('view engine', 'pug'); //Sets the templating engine
	app.set('views', __dirname + '/public/views'); //Sets the views directory

	//Sets up a middleware that serves static pages from public
	app.use(express.static(__dirname + '/public'));

	app.locals.env = process.env; // Make .env accessible to views

	app.set('port', (process.env.PORT || 5000)); //Set the port to either the .env variable or 5000

	require('./app/routes.js')(app); //passes in app to set up the routes

};
