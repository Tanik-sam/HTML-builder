const fs = require('fs');
const path = require('path');
const textPath = path.join(__dirname, 'project-dist', 'bundle.css');
const newFile = fs.createWriteStream(textPath);
newFile.write('');
fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err, files) => {
    if (err)
        console.log("Не могу прочитать директорию styles", err);
    else {
        files.forEach(file => {
            if (path.extname(file.name) === '.css') {
                let data = '';
                let stream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
                stream.on('data', chunk => data += chunk);
                stream.on('end', () => {
                    fs.appendFile(textPath, data, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    })
                })
            }
        })
    }
}
)


