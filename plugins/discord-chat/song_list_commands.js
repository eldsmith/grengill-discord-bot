module.exports = (songList, commandString, grengilBot)=>{
  let commands = commandString.split(' ');
  let songs = [ ... songList.songs];

  commands.map((command)=>{
    switch(command){
      case 'mix':
      case 'm':
        songs = songList.mix(songs);
        break;
      case 'unique':
      case 'u':
        songs = songList.distinct(songs);
        break;
    }
  });

  grengilBot.add(songs);
};
