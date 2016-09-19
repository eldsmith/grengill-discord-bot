require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
var stream;
var dispatcher;
var joinedVoice;
var voiceConnection;

client.on('ready', () => {
  console.log('I am ready!');

});

client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  }

  if (message.content === '!j') {
    joinedVoice = message.member.voiceChannel;
    joinedVoice.join().then(connection => voiceConnection = connection);
  }

  if (message.content === '!p') {
    stream = ytdl('https://www.youtube.com/watch?v=xULTMMgwLuo', {filter : 'audioonly'});
    dispatcher = voiceConnection.playStream(stream);
  }

  if (message.content === '!s') {
    dispatcher.pause();
  }
});

client.login(process.env.BOT_TOKEN);
