/*
Сделать программу-анализатор игровых логов. В качестве
аргумента программа получает путь к файлу. Выведите игровую
статистику: общее количество партий, количество выигранных /
проигранных партий и их соотношение, максимальное число побед /
проигрышей подряд.
*/
const fs = require('fs');
const { promisify } = require('util');

let gamesCount, wins = 0, losses = 0, maxWinsInRow = 0, maxLossesInRow = 0;

const prom = promisify(fs.readFile);
prom('game.log', 'utf8')
    .then(data => data.split(/(\n)/))
    .then(data => {
        data.forEach((val, key) => {
            if(val === '\n') data.splice(key, 1);        
        });
        gamesCount = data.length;
        return data;
    })
    .then(data => {
        let dataObj = {};
        let currentMaxWinsInRow = 0,
            currentMaxLosesInRow =0;
        data.forEach((val, key) =>{
            let dataString = val.split(' ');
            //console.log(dataString);
            dataObj[key] = {
                time: dataString[0],
                choice: parseInt(dataString[1]),
                win: (dataString[2] === 'true'),
            };
            if(dataString[2] === 'true') {
                currentMaxLosesInRow = 0;
                currentMaxWinsInRow++;
                wins++;
                if(currentMaxWinsInRow > maxWinsInRow) maxWinsInRow = currentMaxWinsInRow;
            }
            else {
                currentMaxWinsInRow = 0;
                currentMaxLosesInRow++;
                losses++;
                if(currentMaxLosesInRow > maxLossesInRow) maxLossesInRow = currentMaxLosesInRow;
            }
        });
        console.log(dataObj);
        console.log(`Всего игр сыграно: ${gamesCount}`);
        console.log(`Побед: ${wins} (${Math.round(wins/gamesCount*100)}%)`);
        console.log(`Наибольшее число побед подряд: ${maxWinsInRow}`);
        console.log(`Поражений: ${losses} (${Math.round(losses/gamesCount*100)}%)`);
        console.log(`Наибольшее число поражений подряд: ${maxLossesInRow}`);
    });

