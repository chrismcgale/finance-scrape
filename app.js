const fs = require('fs');
const $ = require('jquery');
const puppeteer = require('puppeteer');
const csv = require('csv-parser')
const { clearLine } = require('readline');

var yahoo = "https://finance.yahoo.com/quote/";
var nasdaq = "https://www.nasdaq.com/market-activity/stocks/";
var earnings = "https://www.macrotrends.net/stocks/charts/";


// open file stream
const csvToArrays = (filename) => {
    let data = [];
    let readStream = fs.createReadStream(filename)
        .pipe(csv())
        .on('data', (row) => {
            console.log(data.length);
            data.push(row.Symbol);
            data.push(row.Name);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            return data;
        });
}


puppeteer.launch({
    headless: true,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
}).then(async browser => {

    // create new page
    const page = await browser.newPage();

    let csvCols = csvToArrays('./constituents.csv');

    console.log(csvCols.length);

    for (i = 0; i < tickers.length; ++i) {
        //Get tick and company name from constituents.csv
        let tick = tickers[i];
        let company = companies[i].replace(/\s/g, '-');
        console.log(tick);
        console.log(company);

        try {
            await page.goto(yahoo.concat(tick));
        } catch (err) {
            throw new PageContactError("Ticker ".concat(tick).concat(" dose not exist"));
        }

        let first = await page.evaluate(() => {
            try {
                page.waitFor('#quote-market-notice', { timeout: 1000 });
                // Set of data needed from Yahoo
                const columns = new Set();
                columns.add('Market_Cap');
                columns.add('Current_Ratio');
                columns.add('P/E'); //Price to Earnings
                columns.add('BV'); //Book value
                columns.add('LTD'); //Long term dept
                columns.add('NCA'); //Net current assets



                //Both on main
                let mrktCap = document.querySelector("#quote-summary > div.Pstart\\(12px\\) > table > tbody > tr > td.Ta\\(end\\) > span").textContent;
                let pe = document.querySelector("#quote-summary > div.Pstart\\(12px\\) > table > tbody > tr:nth-child(3) > td.Ta\\(end\\) > span").textContent;

                page.goto(yahoo.concat(tick.toString(10)).concat("/key-statistics?p=").concat(tick.toString(10)));
                page.waitFor('#quote-market-notice', { timeout: 1000 });
                //On statistics page
                let BV = document.querySelector("table > tbody > tr:nth-child(7) > td:nth-child(2)").textContent;

                let CurrRatio = document.querySelector("tbody:nth-child(9) > tr:nth-child(5) > td:nth-child(2)").textContent;
                //Curr returns Null still

                //Remove stats from url?
                page.goto(yahoo.concat(tick.toString(10)).concat("/balance-sheet?p=").concat(tick.toString(10)));
                //Only on balance sheet
                let ltd = document.querySelectorAll('[title="Long Term Debt"]').parentElement.nextSibling.textContent;

                let CurrAssets = document.querySelectorAll('[title="Total Current Assets"]').parentElement.nextSibling.textContent;
                //nca = Curr assets - Total Liabilities - Preferred Shares

                // init return
                obj =
                {
                    'Market_Cap': mrktCap,
                    'Current_Ratio': currRatio,
                    'P/E': pe,
                    'BV': bv,
                    'LTD': ltd,
                    'NCA': nca
                }

                return obj;
            } catch (err) {
                return -1
            }
        });

        try {
            await page.goto(nasdaq.concat(tick.toString(10)).concat("/dividend-history")); // Do I need toString?
        } catch (err) {
            throw new PageContactError("Ticker ".concat(tick).concat(" dose not exist"));
        }

        //20 years uninterupted dividends
        //If too strict maybe just once per year
        let nodes = document.querySelectorAll(".dividend-history__cell");
        var list = [].slice.call(nodes);
        var divs = list.map(function (e) { return e.innerText; }).join("\n");
        let un = true;

        //Current year
        let year = 21;
        //update every 4 months, denotes how many divs should have been paid this year
        let period = 1;

        for (j = 0; j < 20; ++j) {
            for (k = 1; k < 5; ++k) {
                let test = year - j - ceiling((k - period) / 4);
                if (divs[j * 4 + k].slice(-2) != test) {
                    un = false;
                    break;
                }
            }
        }

        try {
            await page.goto(earnings.concat(tick.toString() + "/").concat(company.toString()).concat("/eps-earnings-per-share-diluted"));
        } catch (err) {
            throw new PageContactError("Ticker ".concat(tick).concat(" dose not exist"));
        }

        //Increase in 3 year average EPS by at least 1/3
        //Returns list of year, eps
        let eps = document.querySelectorAll('table > tbody > tr > td:nth-child(2)');
        //NOTE: eps is in format $X.XX
        let growth = true;
        let positive = true;

        for (j = 0; j < 10; j += 1) {
            eps[j] = parseFloat(eps[m].substring(1));
            if (eps[j] < 0) positive = false;
        }

        let recent = 0;
        for (m = 0; m < 3; m += 1) {
            recent += eps[m];
        }
        recent /= 3;

        let past = 0;
        for (l = 8; l < 11; l += 1) {
            eps[l] = parseFloat(eps[l].substring(1));
            past += eps[l];
        }
        past /= 3;

        //Should be inflation adjusted, is not for now
        if (recent < past * 4 / 3) growth = false;

        csvCols = [];


        await browser.close();
    }

}).catch(function (error) {
    console.error(error);
});


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