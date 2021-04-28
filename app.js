const fs = require('fs');
//const $ = require('jquery');
const puppeteer = require('puppeteer');
const fortunes = './constituents.csv';
const csvParser = require('csv-parser');
const { clearLine } = require('readline');

var yahoo = "https://finance.yahoo.com/quote/";
var nasdaq = "https://www.nasdaq.com/market-activity/stocks/";
var earnings = "https://www.macrotrends.net/stocks/charts/";

function write_to_file(data) {
    string = "";
    for (var it = 0; it < 7; ++it) {
        if( it == 6 ) string += data[it];
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
}

(async function main() {
    // open file stream
    clear('./data');
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

    puppeteer.launch({
        headless: false,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
    }).then(async browser => {

        // create new page
        const page = await browser.newPage();
        page.on('console', consoleObj => console.log(consoleObj.text()));

        for (i = 0; i < tickers.length; i += 2) {
            //Get tick and company name from constituents.csv
            let tick = tickers[i];
            let company = tickers[i + 1].replace(/\s/g, '-');
            console.log(tick);
            console.log(company);

            try {
                await page.goto(yahoo.concat(tick), { waitUntil: 'domcontentloaded' });
            } catch (err) {
                throw new PageContactError("Ticker ".concat(tick).concat(" dose not exist"));
            }

            let first = await page.evaluate(() => {
                //Both on main
                let mrktCap = document.querySelector("#quote-summary > div.Pstart\\(12px\\) > table > tbody > tr > td.Ta\\(end\\) > span").textContent;
                let pe = document.querySelector("#quote-summary > div.Pstart\\(12px\\) > table > tbody > tr:nth-child(3) > td.Ta\\(end\\) > span").textContent;
                return [mrktCap, pe];
            });

            await page.goto(yahoo.concat(tick.toString(10)).concat("/key-statistics?p=").concat(tick.toString(10)));

            let second = await page.evaluate(() => {

                 //page.waitFor('#quote-market-notice', { timeout: 1000 });
                 //On statistics page
                // let BV = document.querySelector("table > tbody > tr:nth-child(7) > td:nth-child(2)").textContent;
               //  let CurrRatio = document.querySelector("tbody:nth-child(9) > tr:nth-child(5) > td:nth-child(2)").textContent;
                 //Curr returns Null still
                 return [0, 0];
             }); 

            //Remove stats from url?
            await page.goto(yahoo.concat(tick.toString(10)).concat("/balance-sheet?p=").concat(tick.toString(10)));

            let third = await page.evaluate(() => {
                //Only on balance sheet
                //let ltd = document.querySelectorAll('[title="Long Term Debt"]').parentElement.nextSibling.textContent;
                //let CurrAssets = document.querySelectorAll('[title="Total Current Assets"]').parentElement.nextSibling.textContent;
                //nca = Curr assets - Total Liabilities - Preferred Shares
               // console.log(ltd)
              //  console.log(CurrAssets)
                return [0];
            });

            try {
                await page.goto(nasdaq.concat(tick.toString(10)).concat("/dividend-history"));
            } catch (err) {
                throw new PageContactError("Ticker ".concat(tick).concat(" dose not exist"));
            }

            let fourth = await page.evaluate(() => {
                //20 years uninterupted dividends
                //If too strict maybe just once per year
                const nodes = document.querySelectorAll(".dividend-history__cell--amount");
                if( nodes.length < 80 ) return false;
                var divs = [];
                for (var i = 0; i < nodes.length ; ++i) divs.push(nodes[i].innerText);
                let un = true;


                //Current year
                let year = 21;
                //update every 4 months, denotes how many divs should have been paid this year
                let period = 1;

                for (j = 0; j < 20; ++j) {
                    for (k = 1; k < 5; ++k) {
                        let test = year - j - Math.ceil((k - period) / 4);
                        console.log(j * 4 + k);
                        if (divs[j * 4 + k].slice(-2) != test) {
                            un = false;
                            break;
                         }
                    }
                }
                return un;
            });

            try {
                await page.goto(earnings.concat(tick.toString() + "/").concat(company.toString()).concat("/eps-earnings-per-share-diluted"));
            } catch (err) {
                throw new PageContactError("Ticker ".concat(tick).concat(" dose not exist"));
            }

            let fifth = await page.evaluate(() => {
                //Increase in 3 year average EPS by at least 1/3
                //Returns list of year, eps
                let earnings = document.querySelectorAll('table > tbody > tr > td:nth-child(2)');
                let eps = [];
                for (var i = 0; i < earnings.length ; ++i) eps.push(earnings[i].innerText);
                //NOTE: eps is in format $X.XX
                let growth = true;
                let positive = true;



                for (j = 0; j < 3; j += 1) {
                    eps[j] = parseFloat(eps[j].substring(1));
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

                console.log(recent)
                console.log(past)

                //Should be inflation adjusted, is not for now
                if (recent < past * 4 / 3) growth = false;
                return [growth, positive];
            });
            const data = [first, second, third, fourth, fifth];

            write_to_file(data);
        }

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
