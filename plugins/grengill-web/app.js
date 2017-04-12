require('dotenv').config();

module.exports = (grengilBot, http) => {

	http.listen(3010, function(){
		console.log('server is running'); //Listen on the port and log success
	});
};
