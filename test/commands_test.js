'use strict';
const assert = require('assert');
require('dotenv').config();
require('../lib/db/db').init(); //Initialize the database
const express = require('express');
const app = express();
const http = require('http').Server(app);
const Grengill = require('../lib/grengill');
const grengilBot = new Grengill(process.env.BOT_TOKEN);
const socket = require('../lib/socket');
const plugins = require('../lib/plugins');

socket(http, app, grengilBot);
plugins(grengilBot, app);

grengilBot.onReady(() => {
	console.log('GrengilBot ready');
	grengilBot.client.channels.map(channel => {
		if (channel.type === 'voice' && channel.name === 'General') {
			grengilBot.join(channel);
		}
	});
});


//require('../plugins/discord-chat/app')(grengilBot); //set everything up
const commandController = require('../plugins/discord-chat/commandController')(grengilBot);


describe('Array', function() {

	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function(done) {
			assert.equal(-1, [1,2,3].indexOf(4));
			grengilBot.onReady(()=>{
				console.log('YEAH!');
				done();
			})
		});
	});
});
