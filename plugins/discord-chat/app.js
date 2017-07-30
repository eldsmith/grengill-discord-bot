'use strict';

//const config = require(process.cwd() + '/lib/config').config(__dirname);
const db = require(process.cwd() + '/lib/db/db');
const commandController = require('./commandController');

let grengilBot;

//TODO: Rethink this approach --perhaps some improvements or redesign of grengill.js
module.exports = grengilBotIn => {
	grengilBot = grengilBotIn;

	//FIXME: Not a great place for this.
	//FIXME: History collection should have ttl or some sort of limit
	grengilBot.on('add', song => {
		song.dateAdded = Date();
		db.addToCollection('history', song);
	});

	grengilBot.onMessage(commandController(grengilBot));

};

//FIXME: Should probably have some sort of util.js for this stuff
function shuffle(a) {
	for (let i = a.length; i; i--) {
		let j = Math.floor(Math.random() * i);
		[a[i - 1], a[j]] = [a[j], a[i - 1]];
	}
}
