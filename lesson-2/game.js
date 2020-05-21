/*
Написать консольную игру "Орел или решка", в которой надо будет
угадывать выпадающее число (1 или 2). В качестве аргумента
программа может принимать имя файла для логирования
результатов каждой партии. В качестве более продвинутой версии
задания можете реализовать простейшую версию игры Blackjack.
*/
const readline = require('readline');
const fs = require('fs');
var path = require('path');

const message = 'Выиграйте у компьютера в игру "Орел и решка" \nвведите 1 - если думаете, что выпаедт орёл \nвведите 2 - если думаете, что выпадет решка \n(Введите exit для выхода)';
const file = `${path.parse(__filename).name}.log`;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

checkFile = (fileName) => {
    fs.exists(fileName, exist => {
        if(!exist){
            fs.open(fileName, 'w', err => {
                if(err) throw err;
                console.log(`Log файл не был обнаружен и был создан ${fileName}`);
            });
        }
    });
};

checkFile(file);

console.log(message);

rl.on('line', cmd => {
    const stat = fs.statSync(file);
    //console.log(stat.size);

    if(parseInt(cmd) === 1 || parseInt(cmd) === 2){
        const computer = Math.floor(1 + Math.random()*2);

        console.log(`Вы выбрали ${cmd}`);
        console.log(`Компьютер загадал ${computer}`);

        console.log('\n=============');
        if(parseInt(cmd) === computer) console.log('ПОБЕДА!');
        else console.log('ПОРАЖЕНИЕ');
        console.log('=============\n');
        let logText = `${(new Date()).getTime()} ${cmd} ${parseInt(cmd) === computer}`;
        logText = stat.size == 0 ? logText : '\n' + logText;
        fs.appendFileSync(file, logText);
    }
    else if(cmd === 'exit') {
        rl.close();
    }
    else {
        console.log(`\nВы ввели неправильное значение, для ввода доступны: 1, 2, exit`);
    }

    console.log(`\n`, message);
});
