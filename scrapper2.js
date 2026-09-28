const fs = require('fs');
function scrapeData() {

    const dom = fs.readFileSync('dom.html', 'utf-8');
    const goats = $(dom).goats(".ig-title").all();

    for (const goat of goats) {
        const title = goat.text();
        const link = goat.attr("href");
    console.log(`Title: ${title}, Link: ${link}`);   

}

}

scrapeData();