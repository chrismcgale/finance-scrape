const puppeteer = require('puppeteer');
const tools = require('./tools');
const { clearLine } = require('readline');

var yahoo = "https://www.nasdaq.com/market-activity/stocks/";
var nasdaq = "https://www.nasdaq.com/market-activity/stocks/";



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



        let pagedata = await page.evaluate(() => {
            try {
                // Set of data needed from Yahoo
                const columns = new Set();
                columns.add('Market_Cap');
                columns.add('Current_Ratio');
                columns.add('P/E');
                columns.add('BV'); //Book value
                columns.add('LTD'); //Long term dept
                columns.add('NCA'); //Net current assets


                // Both on summary page
                let mrktCap = document.querySelector("[data-test='MARKET-CAP-value']").children().innerText; // data-reactid="85"
                let pe = document.querySelector("[data-test='PE_RATIO-value']").children().innerText; // data-reactid="95"

                page.goto(yahoo.concat(tick.toString(10)).concat("/key-statistics?p=").concat(tick.toString(10)));
                //On statistics page
                let BV = document.querySelector("span:contains('Price/Book')").parent().parent().children(class).innerText;
                //Get value
                let CurrRatio = document.querySelector("span:contains('Current Ratio')");
                //Get value

                //Only on balance sheet
                page.goto(yahoo.concat(tick.toString(10)).concat("/balance-sheet?p=").concat(tick.toString(10)));
                let longTermDebt = document.querySelectorAll("span:contains('Long Term Debt')");
                let last = longTermDebt[longTermDebt.length() - 1];
                let debt = last.parent().parent().parent().children("[data-test='fin-col']");
                let ltd = debt[0].children()[0].innerText
                // Make ltd last and next fin-col span value
                let nca = spans[5].innerText; //Curr assets - Total Liabilities - Preferred Shares

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


        pagedata['iterationNum'] = i;
        console.log(pagedata);


        // convert json to string
        pagedata = JSON.stringify(pagedata);

        // save json object to data folder

        csvCols.push(pagedata);

        if (csvCols.length >= MAXCOLS) {

            let string = "";
            for (var z = 0; z < csvCols.length; z++) string += csvCols[z] + '\n';

            fs.appendFile('../Data/data.txt', string, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
            csvCols = [];
        }


        try {
            await page.goto(nasdaq.concat(tick.toString(10)).concat("/dividend-history")); // Do I need toString?
        } catch (err) {
            throw new PageContactError("Ticker ".concat(tick).concat(" dose not exist"));
        }
        let uninterupt = true;
        let growth = true;



        //20 years uninterupted dividends
        //If too strict maybe just once per year
        let divs = document.querySelectorAll(".dividend-history__cell").innerText;
        let year = 21;
        //update every 4 months
        let period = 1;

        for (j = 0; j < 20; ++j) {
            for (k = 1; k < 5; ++k) {
                let test = year - j - ceiling((k - period) / 4);
                if (divs[j * 4 + k].slice(-2) != test) {
                    uninterupt = false;
                    break;
                }
            }
        }

        //Increase in 3 year average EPS by at least 1/3
        //until I can find a reliable site for EPS I will operate under the (sadly not always accurate)
        //Assumption that an increase in EPS results in a uniform increase in dividends and test
        //whether Dividends have increased by 1/3
        let eps = document.querySelectorAll(".dividend-history__cell dividend-history__cell--amount").innerText;
        let recent = 0;
        for(m = 0; m < 12; ++m){
            recent += eps[m];
        }
        recent /= 12;

        let past = 0;
        for(m = 40; m < 52; ++m){
            past += eps[m];
        }
        past /= 12;

        //Should be inflation adjusted, is not for now
        if( recent < past * 4 / 3) growth = false;


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