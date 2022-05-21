const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) =>{
    if (err)
      console.log(err);
    else {
      console.log("\nФайлы директории secret-folder: ");
      files.forEach(file => {
          if(file.isFile()){
        fs.stat(path.join(__dirname,'secret-folder', file.name), (err, stats) => { 
            console.log(`${file.name.split('.')[0]} - ${path.extname(file.name).split('.')[1]} - ${stats.size/1024}kb`);
            })
        }
      })
    }
  })