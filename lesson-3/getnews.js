/*
    Создать программу для получения информации о последних
    новостей с выбранного вами сайта в структурированном виде.
*/
const request = require('request');
const cheerio = require('cheerio');

request('https://rbc.ru/', (err, res, body) => {
    if(!err && res.statusCode === 200){
        const $ = cheerio.load(body);

        const news = $('.main__feed__title');
        for(let i = 0; i < news.length; i++){
            console.log(i + 1, ':',news.eq(i).text());
        } 
    }
});