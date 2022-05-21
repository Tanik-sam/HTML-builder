const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });

const notes = fs.createWriteStream(path.join(__dirname, 'mynotes.txt'));
output.write('Введите текст для записи в файл\n');
    rl.on('line', line => {
        if (line.trim() !== 'exit') {
            notes.write(`${line}\n`);
        } else {
            rl.close();
            process.exit()
        }
    })  
    process.on('exit', () => output.write('Пока-пока. Обращайтесь, если что.'));
