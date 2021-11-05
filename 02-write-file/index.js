const fs = require('fs');
const process = require('process');
const path = require('path');

const outputFile = fs.createWriteStream(path.join(__dirname, 'text.txt'));


const readline = require('readline');
let lastAnswer = '';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Start your text here: \n'
});
rl.prompt();
rl.on('line', (line) => {
    switch (line.trim()) {
        case 'exit':
            rl.close();
            break;

        default:
            outputFile.write(line + '\n');
            break;
    }

}).on('close', () => {
    console.log('All saved!');
    outputFile.close();
    process.exit(0);

});