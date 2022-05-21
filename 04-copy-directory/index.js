const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

fsPromises.mkdir(path.join(__dirname, 'files-copy')).then(function () {
    console.log('Директория успешно создана');
}).catch(function () {
    console.log('Директория не создана');
});

fs.readdir(path.join(__dirname, 'files'), { withFileTypes: true }, (err, files) => {
    if (err)
        console.log("Не могу прочитать директорию files", err);
    else {
        console.log("\nСкопированные файлы:")
        files.forEach(file => {
            if (file.isFile()) {
                fs.copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name),
                    fs.constants.COPYFILE_EXCL, (err) => {
                        if (err) {
                            console.log(`\nА такой файл ${file.name}  директории files-copy уже есть!:`);
                        }
                        else {
                            console.log(file.name)
                        }
                    });
            }
        })
    }
})

