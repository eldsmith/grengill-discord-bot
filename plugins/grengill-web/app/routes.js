var youtubeCtrl = require('./controllers/youtubeController');

//Sets the routes to the core controller methods they correspond to
module.exports = function(app){
  app.get('/', (req, res)=>{
    res.render('index');
  });

  app.get('/search', youtubeCtrl.search);
};
