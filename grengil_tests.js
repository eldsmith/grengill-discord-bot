let textChannel;
let voice;
let Grengill = require("./lib/grengill");
const Discord = require("discord.js");

const testSongs = [
  "milkshake",
  "kavinsky",
  "all the single ladies",
  "moana shiny",
  "mulan ill make a man out of you"
];

const addMany = songs => {
  songs.map(song => {
    textChannel.send("!add " + song);
  });
};

module.exports = grengilBot => {
  const userBot = new Discord.Client();
  userBot.login(process.env.TEST_USERBOT);

  userBot.on("ready", () => {
    userBot.on('message', message =>{
      console.log(message.content);
    })

    userBot.channels.map(channel => {
      if (channel.type === "text" && channel.name === "general") {
        textChannel = channel;
      }
    });

    if (textChannel) {
      addMany(testSongs);
    }
  });
};
