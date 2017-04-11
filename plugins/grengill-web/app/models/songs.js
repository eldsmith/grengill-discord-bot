
const db = require('../util/db');

exports.add = (song)=>{
  db.insertDocuments('songs', [song]);
};
