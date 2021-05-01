const fs = require('fs');
//const $ = require('jquery');
const puppeteer = require('puppeteer');
const fortunes = './constituents.csv';
const csvParser = require('csv-parser');
const { clearLine } = require('readline');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');

var yahoo = "https://finance.yahoo.com/quote/";
var nasdaq = "https://www.nasdaq.com/market-activity/stocks/";
var earnings = "https://www.macrotrends.net/stocks/charts/";

function write_to_file(data) {
    string = "";
    for (var it = 0; it < 5; ++it) {
        if (it == 6) string += data[it];
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        page.setDefaultNavigationTimeout(300000);
        page.on('console', consoleObj => console.log(consoleObj.text()));

        for (i = 0; i < tickers.length; i += 2) {

            //To bypass rate limit, every 7 stocks wait 1 minute
            if(i % 14 == 0 && i != 0) await sleep(6000);

            //Get tick and company name from constituents.csv
            let tick = tickers[i].replace('.', '-');
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

            await page.goto(yahoo.concat(tick.toString(10)).concat("/balance-sheet?p=").concat(tick.toString(10)),
                { waitUntil: 'networkidle0' });
            //Speed up
            //Total Assets
            await page.click("#Col1-1-Financials-Proxy > section > div.Pos\\(r\\) > div.W\\(100\\%\\).Whs\\(nw\\).Ovx\\(a\\).BdT.Bdtc\\(\\$seperatorColor\\) > div > div.D\\(tbrg\\) > div:nth-child(1) > div.D\\(tbr\\).fi-row.Bgc\\(\\$hoverBgColor\\)\\:h > div.D\\(tbc\\).Ta\\(start\\).Pend\\(15px\\)--mv2.Pend\\(10px\\).Bxz\\(bb\\).Py\\(8px\\).Bdends\\(s\\).Bdbs\\(s\\).Bdstarts\\(s\\).Bdstartw\\(1px\\).Bdbw\\(1px\\).Bdendw\\(1px\\).Bdc\\(\\$seperatorColor\\).Pos\\(st\\).Start\\(0\\).Bgc\\(\\$lv2BgColor\\).fi-row\\:h_Bgc\\(\\$hoverBgColor\\).Pstart\\(15px\\)--mv2.Pstart\\(10px\\) > div.D\\(ib\\).Va\\(m\\).Ell.Mt\\(-3px\\).W\\(215px\\)--mv2.W\\(200px\\).undefined > button");
            //Total Liabilities
            await page.click("#Col1-1-Financials-Proxy > section > div.Pos\\(r\\) > div.W\\(100\\%\\).Whs\\(nw\\).Ovx\\(a\\).BdT.Bdtc\\(\\$seperatorColor\\) > div > div.D\\(tbrg\\) > div:nth-child(2) > div.D\\(tbr\\).fi-row.Bgc\\(\\$hoverBgColor\\)\\:h > div.D\\(tbc\\).Ta\\(start\\).Pend\\(15px\\)--mv2.Pend\\(10px\\).Bxz\\(bb\\).Py\\(8px\\).Bdends\\(s\\).Bdbs\\(s\\).Bdstarts\\(s\\).Bdstartw\\(1px\\).Bdbw\\(1px\\).Bdendw\\(1px\\).Bdc\\(\\$seperatorColor\\).Pos\\(st\\).Start\\(0\\).Bgc\\(\\$lv2BgColor\\).fi-row\\:h_Bgc\\(\\$hoverBgColor\\).Pstart\\(15px\\)--mv2.Pstart\\(10px\\) > div.D\\(ib\\).Va\\(m\\).Ell.Mt\\(-3px\\).W\\(215px\\)--mv2.W\\(200px\\).undefined > button");
            //Total Non Current Liabilities
            await page.click("#Col1-1-Financials-Proxy > section > div.Pos\\(r\\) > div.W\\(100\\%\\).Whs\\(nw\\).Ovx\\(a\\).BdT.Bdtc\\(\\$seperatorColor\\) > div > div.D\\(tbrg\\) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div.D\\(tbr\\).fi-row.Bgc\\(\\$hoverBgColor\\)\\:h > div.D\\(tbc\\).Ta\\(start\\).Pend\\(15px\\)--mv2.Pend\\(10px\\).Bxz\\(bb\\).Py\\(8px\\).Bdends\\(s\\).Bdbs\\(s\\).Bdstarts\\(s\\).Bdstartw\\(1px\\).Bdbw\\(1px\\).Bdendw\\(1px\\).Bdc\\(\\$seperatorColor\\).Pos\\(st\\).Start\\(0\\).Bgc\\(\\$lv2BgColor\\).fi-row\\:h_Bgc\\(\\$hoverBgColor\\).Pstart\\(30px\\)--mv2.Pstart\\(25px\\) > div.D\\(ib\\).Va\\(m\\).Ell.Mt\\(-3px\\).W\\(200px\\)--mv2.W\\(185px\\).undefined > button");

            let third = await page.evaluate(() => {
                //Only on balance sheet
                let ltd = document.querySelector("#Col1-1-Financials-Proxy > section > div.Pos\\(r\\) > div.W\\(100\\%\\).Whs\\(nw\\).Ovx\\(a\\).BdT.Bdtc\\(\\$seperatorColor\\) > div > div.D\\(tbrg\\) > div:nth-child(2) > div:nth-child(2) > div.rw-expnded > div:nth-child(2) > div:nth-child(1) > div.D\\(tbr\\).fi-row.Bgc\\(\\$hoverBgColor\\)\\:h > div:nth-child(2)").innerText;
                ltd = ltd.replace(',', '');
                let currAssets = document.querySelector("#Col1-1-Financials-Proxy > section > div:nth-child(3) > div > div > div:nth-child(2) > div div:nth-child(2) > div > div > div:nth-child(2)").innerText;
                currAssets = currAssets.replace(',', '');
                let totalLia = document.querySelector("#Col1-1-Financials-Proxy > section > div.Pos\\(r\\) > div.W\\(100\\%\\).Whs\\(nw\\).Ovx\\(a\\).BdT.Bdtc\\(\\$seperatorColor\\) > div > div.D\\(tbrg\\) > div:nth-child(3) > div.D\\(tbr\\).fi-row.Bgc\\(\\$hoverBgColor\\)\\:h > div:nth-child(2)").innerText;
                totalLia = totalLia.replace(',', '');
                let nca = currAssets - totalLia;
               // console.log(ltd)
                //console.log(nca)
                if (ltd > nca) return false;
                return true;
            });

            try {
                await page.goto(nasdaq.concat(tick.toString(10)).concat("/dividend-history"),
                    { waitUntil: 'domcontentloaded' });
            } catch (err) {
                throw new PageContactError("Ticker ".concat(tick).concat(" dose not exist"));
            }

            let fourth = await page.evaluate(() => {
                //20 years uninterupted dividends
                //If too strict maybe just once per year
                const nodes = document.querySelectorAll(".dividend-history__cell");
                if (nodes.length / 3 < 80) return false;
                var divs = [];
                for (var i = 0; i < nodes.length; i += 3) divs.push(nodes[i].innerText);
                let un = true;


                //Current year
                let year = 21;
                //Update every quarter, denotes how many divs should have been paid this year 
                let period = 1;

                for (j = 0; j < 20; ++j) {
                    for (k = 1; k < 5; ++k) {
                        //After period number of divs, we should be checking for year prior to year
                        let test = year - j - Math.ceil((k - period) / 4);
                        //Check if last 2 digits of date are equal to curr (If not a div was skipped)
                        if (divs[j * 4 + k].slice(-2) < test) {
                            un = false;
                            break;
                        }
                    }
                }
                return un;
            });

            try {
                await page.goto(earnings.concat(tick.toString() + "/").concat(company.toString()).concat("/eps-earnings-per-share-diluted"),
                    { waitUntil: 'domcontentloaded' });
            } catch (err) {
                throw new PageContactError("Ticker ".concat(tick).concat(" dose not exist"));
            }

            let fifth = await page.evaluate(() => {
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
