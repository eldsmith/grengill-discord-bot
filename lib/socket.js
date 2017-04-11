"use strict";
const YouTube = require(process.cwd() + '/lib/youtube');

module.exports = (http, app, grengilBot)=> {
  const io = require('socket.io')(http);

  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('songAdd', (song, callback)=>{
      song = YouTube.getVideoInfo(song, {part : 'snippet'}).then((results)=>{

        let result = {
          id: results.items[0].id,
          title: results.items[0].snippet.title
        };

        grengilBot.add(result);
        callback();
      });
    });

  });


  http.listen(3010, function(){
    console.log('listening on *:3010');
  });
}
