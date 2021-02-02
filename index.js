const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Sheet = require('./sheet');

async function scrapePage(i) {
    const res = await fetch(`https://explodingtopics.com/topics-this-month?page=${i}`);
    const text = await res.text();
    const $ = await cheerio.load(text);
    const containers = $('.topicInfoContainer').toArray();
    const trends = containers.map(c => {
        const active = $(c);
        const keyword = active.find('.tileKeyword').text();
        const description = active.find('.tileDescription').text();
        const searchesPerMonth = active.find('.scoreTag').first().text().split('mo')[1];
        return { keyword, description, searchesPerMonth };
    })
    return trends;
}


(async function () {
    let i = 5;
    let trends = [];
    while (true) {
        const newTrends = await scrapePage(i);
        if (newTrends.length === 0) break;
        trends = trends.concat(newTrends);
        i++;
    }

    const sheet = new Sheet();
    await sheet.load();
    await sheet.addRows(trends);
})();


