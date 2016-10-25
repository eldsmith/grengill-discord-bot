var grengilBot;
const Loki = require('lokijs');
const db = new Loki('./lib/db/db.json');

db.loadDatabase({}, (result)=>{
  console.log();
})
