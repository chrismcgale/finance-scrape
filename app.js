const puppeteer = require('puppeteer');
const tools = require('./tools');
const { clearLine } = require('readline');

var yahoo = "https://finance.yahoo.com/quote/";
var nasdaq = "https://www.nasdaq.com/market-activity/stocks/";
var earnings = "https://www.macrotrends.net/stocks/charts/";



puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
}).then(async browser => {

    // create new page
    const page = await browser.newPage();

    // open file stream
    const fs = require('fs');

    var csvCols = $.csv.toArrays(constituents.csv);

    for (i = 0; i < csvCols.length(); ++i) {
        //Get tick from constituents.csv
        var tick = csvCols[i];
        console.log(tick);
        //Just get ticker

        // go to the appropriate url
        try {
            await page.goto(yahoo.concat(tick.toString(10))); // Do I need toString?
        } catch (err) {
            throw new PageContactError("Ticker ".concat(tick).concat(" dose not exist"));
        }



        let frst = await page.evaluate(() => {
            try {
                // Set of data needed from Yahoo
                const columns = new Set();
                columns.add('Market_Cap');
                columns.add('Current_Ratio');
                columns.add('P/E');
                columns.add('BV'); //Book value
                columns.add('LTD'); //Long term dept
                columns.add('NCA'); //Net current assets


                await page.waitFor('#quote-market-notice', {timeout: 1000});
                //Both on main
                let mrktCap = document.querySelector("#quote-summary > div.Pstart\\(12px\\) > table > tbody > tr > td.Ta\\(end\\) > span").textContent;
                let pe = document.querySelector("#quote-summary > div.Pstart\\(12px\\) > table > tbody > tr:nth-child(3) > td.Ta\\(end\\) > span").textContent;

                page.goto(yahoo.concat(tick.toString(10)).concat("/key-statistics?p=").concat(tick.toString(10)));
                await page.waitFor('#quote-market-notice', {timeout: 1000});
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


        first['iterationNum'] = i;
        console.log(first);


        // convert json to string
        first = JSON.stringify(pagedata);

        // save json object to data folder

        csvCols.push(first);


        try {
            await page.goto(nasdaq.concat(tick.toString(10)).concat("/dividend-history")); // Do I need toString?
        } catch (err) {
            throw new PageContactError("Ticker ".concat(tick).concat(" dose not exist"));
        }
        let un = true;
        let growth = true;



        //20 years uninterupted dividends
        //If too strict maybe just once per year
        let divs = document.querySelectorAll(".dividend-history__cell").innerText;
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

        //Name needs dashes instead of spaces
        try {
            await page.goto(earnings.concat(tick.toString(10 + "/")).concat(company.toString()).concat("/eps-earnings-per-share-diluted"));
        } catch (err) {
            throw new PageContactError("Ticker ".concat(tick).concat(" dose not exist"));
        }

        //Increase in 3 year average EPS by at least 1/3
        //Returns list of year, eps
        let eps = document.querySelector(".historical_data_table table").children(tbody).children(tr).children(td).innerText;
        let recent = 0;
        for(m = 1; m < 7; m += 2){
            recent += eps[m];
        }
        recent /= 12;

        let past = 0;
        for(m = 20; m < 28; m += 2){
            past += eps[m];
        }
        past /= 12;

        //Should be inflation adjusted, is not for now
        if( recent < past * 4 / 3) growth = false;


        let string = "";
        for (var z = 0; z < csvCols.length; z++) string += csvCols[z] + '\n';

        fs.appendFile('../Data/data.txt', string, function (err) {
        if (err) throw err;
            console.log('Saved!');
        });
        csvCols = [];


        await browser.close();

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