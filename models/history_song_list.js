const SongList = require('./song_list');
const db = require('../lib/db/db');

//TODO: fetch every time grengilbot songs are updated
class HistorySongList extends SongList {
  constructor(songs = []){
    super(songs);

    this.fetch();
  }

  //fetch songs from history
  fetch(){
    db.getCollection('history', (data)=>{
      this.songs = data.chain().find().simplesort('dateAdded', true).data();
    });
  }

  distinct(songs = this.songs){
    let found = [], ret = [];
    for(let i = 0; i < songs.length; i++) {
      if(found.indexOf(songs[i].id) === -1) {
        found.push(songs[i].id);
        ret.push(songs[i]);
      }
    }

    return ret;
  }
}

module.exports = HistorySongList;
