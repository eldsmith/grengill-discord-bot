module.exports = (grengilBot, app) => {
  var normalizedPath = require("path").join(__dirname, "../plugins");

  try {
    require("fs")
      .readdirSync(normalizedPath)
      .forEach(function(file) {
        require(__dirname + "/../plugins/" + file + "/app")(grengilBot, app);
      });
  } catch (error) {
    console.log("Error requiring plugin:");
    console.error(error);
  }
};
