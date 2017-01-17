class SongList {
  constructor(songs = []){
    this.songs = songs;
  }

  mix(songs=this.songs){
    let mixedList = [ ... songs];
    for (let i = mixedList.length; i >= 1; i--) {
      let rand = Math.floor(Math.random() * i);
      [mixedList[i - 1], mixedList[rand]] = [mixedList[rand], mixedList[i - 1]];
    }
    
    return mixedList;
  }
}

module.exports = SongList;