/*
    Создать переводчик слов с английского на русский, который будет
    обрабатывать входящие GET запросы и возвращать ответы,
    полученные через API Яндекс.Переводчика.
    Ссылка для получения ключа API Яндекс.Переводчика:
    http://api.yandex.ru/key/form.xml?service=trnsl
    Документация API Переводчика:
    http://api.yandex.ru/translate/doc/dg/reference/translate.xml
    Пример GET запроса к API:
    https://translate.yandex.net/api/v1.5/tr.json/translate?key={сюда-подставитьключ}&lang=ru-en
*/

const request = require('request');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const yandexTranslatorUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate?';
const key = 'trnsl.1.1.20200503T160138Z.a9be05ebf51ec40b.3d1efcd607b683e74b074cf95574296a202589f8&';
const lang = 'en-ru';

translator = (word) => {
    request(yandexTranslatorUrl + 'key=' + key + 'text=' + word + '&' + 'lang=' + lang, (err, res, body) => {
        if(!err && res.statusCode === 200) {
            const result = JSON.parse(body);
            console.log('Перевод:',result.text[0]);
        }
    });
};

rl.on('line', word => {
    translator(word);
});