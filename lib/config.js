exports.config = (dir)=>{
  require('fs').readFile(dir + '/config.json', "utf-8", (err, data)=>{
    if(err){
      if(err.code === "ENOENT"){
        console.log('No config.json.');
        return {};
      }
      else{
        throw err;
      }
    }

    return JSON.parse(data);
  });
};
