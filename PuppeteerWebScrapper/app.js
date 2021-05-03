const fs = require('fs');
//const $ = require('jquery');
const puppeteer = require('puppeteer');
const fortunes = './constituents.csv';
const csvParser = require('csv-parser');
//const { clearLine } = require('readline');
//const { sleep } = require('constants');


var yahoo = "https://finance.yahoo.com/quote/";
var dividends = "https://dividendhistory.org/payout/";
var nas = "https://www.nasdaq.com/market-activity/stocks/";
var earnings = "https://www.macrotrends.net/stocks/charts/";

function write_to_file(data) {
    string = "";
    for (var it = 0; it < 6; ++it) {
        if (it == 5) string += data[it];
        else string += data[it] + ',';
    }
    string += '\n'
    fs.appendFile('./data.csv', string, function (err) {
        if (err) throw err;
    });
}

function clear(filename) {
    fs.writeFile('./data.csv', '', function (err) {
        if (err) throw err;
    });
    let string = "Name,Market-Cap,Price-to-Earnings,Price-to-Book,Current-Ratio,Financial-Position,Uninterupted-Divs,Ten-year-growth,No-Earnings-Deficit" + '\n';
    fs.appendFile('./data.csv', string, function (err) {
        if (err) throw err;
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



(async function main() {
    // open file stream

    //If Starting from the middle comment out this line and set i to 2 * row - 4
    //clear('./data');


    let tickers = [];
    let readStream = fs.createReadStream(fortunes)
        .pipe(csvParser())
        .on('data', (row) => {
            //console.log(ticks.length);
            tickers.push(row.Symbol);
            tickers.push(row.Name);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });

   await puppeteer.launch({
            headless: false,
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080', '--single-process', '--no-zygote']
        }).then(async browser => {

            // create new page
            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(30000);
            page.on('console', consoleObj => console.log(consoleObj.text()));

            for (i = 0; i < 1010; i += 2) {
                try {
                    //Get tick and company name from constituents.csv
                    let tick = tickers[i].replace('.', '-');
                    let name = tickers[i + 1];
                    let company = tickers[i + 1].replace(/\s/g, '-');
                    //console.log(tick);
                    //console.log(company);

                    try {
                        await page.goto(yahoo.concat(tick), { waitUntil: 'domcontentloaded' },
                            { waitUntil: 'domcontentloaded' });
                    } catch (err) {
                        throw new PageContactError("Ticker ".concat(tick).concat(" dose not exist"));
                    }

                    let first = await page.evaluate(() => {
                        //Both on summary page
                        let mrktCap = document.querySelector("#quote-summary > div.Pstart\\(12px\\) > table > tbody > tr > td.Ta\\(end\\) > span").textContent;
                        let pe = document.querySelector("#quote-summary > div.Pstart\\(12px\\) > table > tbody > tr:nth-child(3) > td.Ta\\(end\\) > span").textContent;
                        return [mrktCap, pe];
                    });

                    await page.goto(yahoo.concat(tick.toString(10)).concat("/key-statistics?p=").concat(tick.toString(10)),
                        { waitUntil: 'domcontentloaded' });


                    let second = await page.evaluate(() => {

                        //On statistics page
                        let PBV = document.querySelector("table > tbody > tr:nth-child(7) > td:nth-child(2)").textContent;
                        let CurrRatio = document.querySelector("#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div:nth-child(3) > div > div:nth-child(5) > div > div > table > tbody > tr:nth-child(5) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)").innerText;
                        return [PBV, CurrRatio];
                    });

                    let third = true;

                    try {
                        await page.goto(nas.concat(tick.toString(10)).concat("/financials"), { waitUntil: 'domcontentloaded' });
                        await page.waitForSelector("body > div.dialog-off-canvas-main-canvas > div > main > div.page__content > div.quote-subdetail__content.quote-subdetail__content--new > div:nth-child(3) > div > div.quote-subdetail__indented-components > div > div.financials.financials--large-numbers > div > div.financials__heading > div.financials__controls > div > div > div > button:nth-child(2)");
                        await page.click("body > div.dialog-off-canvas-main-canvas > div > main > div.page__content > div.quote-subdetail__content.quote-subdetail__content--new > div:nth-child(3) > div > div.quote-subdetail__indented-components > div > div.financials.financials--large-numbers > div > div.financials__heading > div.financials__controls > div > div > div > button:nth-child(2)");
                        third = await page.evaluate(() => {
                            //Only on balance sheet
                            //let ltd = document.querySelector("#Col1-1-Financials-Proxy > section > div.Pos\\(r\\) > div.W\\(100\\%\\).Whs\\(nw\\).Ovx\\(a\\).BdT.Bdtc\\(\\$seperatorColor\\) > div > div.D\\(tbrg\\) > div:nth-child(2) > div:nth-child(2) > div.rw-expnded > div:nth-child(2) > div:nth-child(1) > div.D\\(tbr\\).fi-row.Bgc\\(\\$hoverBgColor\\)\\:h > div:nth-child(2)").innerText;
                            let ltd = document.querySelector("body > div.dialog-off-canvas-main-canvas > div > main > div.page__content > div.quote-subdetail__content.quote-subdetail__content--new > div:nth-child(3) > div > div.quote-subdetail__indented-components > div > div.financials.financials--large-numbers > div > div.financials__body-container.loaded > div.financials__body > div.financials__panel.financials__panel--active > table > tbody > tr:nth-child(21) > td:nth-child(2)").innerText;
                            ltd = parseFloat(ltd.substring(1).replaceAll(',', ''));
                            console.log(ltd)
                            //let currAssets = document.querySelector("#Col1-1-Financials-Proxy > section > div:nth-child(3) > div > div > div:nth-child(2) > div div:nth-child(2) > div > div > div:nth-child(2)").innerText;
                            let currAssets = document.querySelector("body > div.dialog-off-canvas-main-canvas > div > main > div.page__content > div.quote-subdetail__content.quote-subdetail__content--new > div:nth-child(3) > div > div.quote-subdetail__indented-components > div > div.financials.financials--large-numbers > div > div.financials__body-container.loaded > div.financials__body > div.financials__panel.financials__panel--active > table > tbody > tr:nth-child(7) > td:nth-child(2)").innerText;
                            currAssets = parseFloat(currAssets.substring(1).replaceAll(',', ''));
                            console.log(currAssets)
                            //let totalLia = document.querySelector("#Col1-1-Financials-Proxy > section > div.Pos\\(r\\) > div.W\\(100\\%\\).Whs\\(nw\\).Ovx\\(a\\).BdT.Bdtc\\(\\$seperatorColor\\) > div > div.D\\(tbrg\\) > div:nth-child(3) > div.D\\(tbr\\).fi-row.Bgc\\(\\$hoverBgColor\\)\\:h > div:nth-child(2)").innerText;
                            let currLia = document.querySelector("body > div.dialog-off-canvas-main-canvas > div > main > div.page__content > div.quote-subdetail__content.quote-subdetail__content--new > div:nth-child(3) > div > div.quote-subdetail__indented-components > div > div.financials.financials--large-numbers > div > div.financials__body-container.loaded > div.financials__body > div.financials__panel.financials__panel--active > table > tbody > tr:nth-child(20) > td:nth-child(2)").innerText;
                            currLia = parseFloat(currLia.substring(1).replaceAll(',', ''));
                            console.log(currLia)
                            let nwc = currAssets - currLia;
                            if (nwc < ltd) return false;
                            return true;
                        });
                    } catch (err) {
                        third = "N/A"
                    }

                    let fourth = true;

                    try {
                        await page.goto(dividends.concat(tick.toString(10)),
                            { waitUntil: 'domcontentloaded' });
                        fourth = await page.evaluate(() => {
                            //20 years uninterupted dividends
                            //If too strict maybe just once per year
                            let curr = 21;
                            let con = true;
                            let last = -1;
                            while (con) {

                                const nodes = document.querySelectorAll('[role="row"]');
                                var divs = [];
                                for (var i = 1; i < nodes.length; i += 1) divs.push(nodes[i].innerText);
                                if (divs.length < 15) con = false;

                                let year = parseFloat(divs[0].substring(2, 4));
                                let month = parseFloat(divs[0].substring(5, 7))
                                //15 divs per page
                                for (j = 1; j < divs.length - 1; ++j) {
                                    if (year < curr - 20) break;
                                    //If a year was skipped or if dividends were more than 3 months apart
                                    let next = parseFloat(divs[j].substring(2, 4));
                                    let prev = parseFloat(divs[j].substring(5, 7));
                                    let diff = month - prev;
                                    if (year - next > 1 || ((diff % 12) + 12) % 12 != 3) return false;
                                    year = next;
                                    month = prev;
                                }
                                if(last == year) return false;
                                last = year;
                                if (!con & year > curr - 20) return false;
                                if (year < curr - 20) break;
                                console.log(year);
                                document.querySelector("#dividend_table_next").click();
                            }
                            return true;
                        });
                    } catch (err) {
                        fourth = "N/A";
                    }


                    let fifth = [true, true];

                    try {
                        await page.goto(earnings.concat(tick.toString() + "/").concat(company.toString()).concat("/eps-earnings-per-share-diluted"),
                            { waitUntil: 'domcontentloaded' });
                        fifth = await page.evaluate(() => {
                            //Increase in 3 year average EPS by at least 1/3
                            //Returns list of year, eps
                            let earnings = document.querySelectorAll('table > tbody > tr > td:nth-child(2)');
                            let eps = [];
                            for (var i = 0; i < earnings.length; ++i) eps.push(earnings[i].innerText);
                            //NOTE: eps is in format $X.XX
                            let growth = true;
                            let positive = true;
                            let past = 0;
                            let recent = 0;

                            for (j = 0; j < 11; j += 1) {
                                eps[j] = parseFloat(eps[j].substring(1));
                                if (eps[j] < 0) positive = false;
                            }

                            for (m = 0; m < 3; m += 1) recent += eps[m];
                            recent /= 3;

                            for (l = 8; l < 11; l += 1) past += eps[l];

                            past /= 3;

                            //Should be inflation adjusted, is not for now
                            if (recent < past * 4 / 3) growth = false;
                            return [growth, positive];
                        });
                    } catch (error) {
                        fifth = ["N/A", "N/A"];
                    }
                    const data = [name, first, second, third, fourth, fifth];
                    write_to_file(data);
                } catch (error) {
                    console.error(error);
                }
            }

            //await page.close();

        }).catch(function (error) {
            console.error(error);

        });
})();


// Error classes 
class PageContactError extends Error {
    constructor(message) {
        super(message); // (1)
        this.name = "PageContactError"; // (2)
    }
}

class BadRowError extends Error {
    constructor(message) {
        super(message); // (1)
        this.name = "BadRowError"; // (2)
    }
}
