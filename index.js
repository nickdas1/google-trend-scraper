const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Sheet = require('./sheet');

(async function () {
    const res = await fetch('https://explodingtopics.com/topics-this-month');
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

    const sheet = new Sheet();
    await sheet.load();

    //create a new sheet for each day and add trends

    const newSheet = await sheet.doc.addSheet(
        {
            title: `${new Date().toDateString()}`,
            headerValues: ['keyword', 'description', 'searchesPerMonth']
        }
    )

    await newSheet.addRows(trends);
})();
