require('dotenv').config();

var app = require('./app/server'); //import the contents of servers module.exports

app.locals.env = process.env; // Make .env accessible to views

app.set('port', (process.env.PORT || 5000)); //Set the port to either the .env variable or 5000

app.listen(app.get('port'), function(){
  console.log('server is running'); //Listen on the port and log success
});


// Just export an empty function as plugin importer expects a function return
module.exports = () => {

};
