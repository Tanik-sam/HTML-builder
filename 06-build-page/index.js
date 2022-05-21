const { createDecipheriv } = require('crypto');
const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const textPath = path.join(__dirname, 'template.html');
const textPath2 = path.join(__dirname, 'project-dist','index.html');

fsPromises.mkdir(path.join(__dirname, 'project-dist')).then(function () {
    console.log('Директория project-dist успешно создана');   
}).catch(function () {
    console.log('Директория project-dist уже существует');
});

let components=[];
let text = '';
(async function f1() {
    let promise = new Promise((resolve, reject) => {
        
        const stream = fs.createReadStream(textPath, 'utf-8');
        
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
            text = data;
            while (text.indexOf('{{') !== -1) {
                let arr = []
                let start = text.indexOf('{{') + 2
                let i = 0
                while (text[start + i] !== '}') {
                   // console.log(text[start + i])
                    arr.push(text[start + i])
                    i++
                }
                components.push(arr.join(''))
                resolve(components)
                text = text.replace(`{{${arr.join('')}}}`, `<${arr.join('')}>`)
            }
        })
        stream.on('error', error => console.log('Error', error.message));
    })
    let co=await promise

        await (async function f2() {
            for (const compName of co) {
                let promise = new Promise((resolve, reject) => {
                    let data = ''
                    let stream2 = fs.createReadStream(path.join(__dirname, 'components', (compName + '.html')), 'utf-8');
                    stream2.on('data', chunk => data += chunk);
                    stream2.on('end', () => {
                        text = text.replace(`<${compName}>`, data)
                        resolve(text)
                        stream2.on('error', error => console.log('Error', error.message));
                    })

                })
                text = await promise
            }
            fs.writeFile(
                textPath2,text,
                (err) => {
                    if (err) throw err;
                    console.log('Файл был создан');
                }
            );
        })()
    // 
    
}) ()

const textPath3 = path.join(__dirname, 'project-dist', 'style.css');
const newFile = fs.createWriteStream(textPath3);
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
                    fs.appendFile(textPath3, data, (err) => {
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
const textPath4 = path.join(__dirname, 'project-dist', 'assets');
const textPath5 = path.join(__dirname,'assets');
fsPromises.mkdir(textPath4).then(function () {
    console.log('Директория assets успешно создана');
    createDir(textPath4,textPath5);
}).catch(function () {
    console.log('Директория assets уже существует');
    createDir(textPath4,textPath5);
});

function createDir(tp4,tp5){
    fs.readdir(tp5, { withFileTypes: true }, (err, files) => {
        if (err)
            console.log("Не могу прочитать директорию assets", err);
        else {

            files.forEach(file => {
                if (file.isFile()) {
                    fs.copyFile(path.join(tp5, file.name), path.join(tp4, file.name),
                        fs.constants.COPYFILE_EXCL, (err) => {
                            if (err) {
                                console.log(`\nА такой файл ${file.name}  директории project-dist/assets уже есть!:`);
                            }
                        });
                        return;
                }
                else {
                    const textPath6 = path.join(tp4, file.name);
                    const textPath7 = path.join(tp5, file.name);
                    fsPromises.mkdir(textPath6).then(function () {
                        console.log(`Директория ${file.name} успешно создана`);
                        createDir(textPath6,textPath7)
                    }).catch(function () {
                        console.log(`Директория ${file.name} уже существует`);
                        createDir(textPath6,textPath7)
                    });
                }
            })
        }
    })
}