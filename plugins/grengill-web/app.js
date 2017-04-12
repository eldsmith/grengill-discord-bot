require('dotenv').config();

module.exports = (grengilBot, http) => {

	http.listen((process.env.PORT || 5000), function(){
		console.log('server is running'); //Listen on the port and log success
	});
};
