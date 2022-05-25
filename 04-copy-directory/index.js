const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

(async function () {
    try {
        await fsPromises.rm(path.join(__dirname, 'files-copy'), { force: true, recursive: true })
        await fsPromises.mkdir(path.join(__dirname, 'files-copy')).then(function () {
            console.log('Директория успешно создана');
        }).then(
            fs.readdir(path.join(__dirname, 'files'), { withFileTypes: true }, (err, files) => {
                if (err)
                    console.log("Не могу прочитать директорию files", err);
                else {
                    console.log("\nСкопированные файлы:")
                    files.forEach(async (file) => {
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
            }))

    } catch (err) { console.log(error) }
})()