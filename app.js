const puppeteer = require('puppeteer');
const tools = require('./tools')

var yahoo = "https://finance.yahoo.com/quote/"
var street = "https://www.streetinsider.com/dividend_history.php?q="

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

    var csvCols = [];

    // this does nothing atm
    var endofentries = false;
    while (!endofentries) {


        //Get tick from constiutuents.csv
        var tick =;

        // go to the appropriate url
        try {
            await page.goto(yahoo.concat(tick.toString(10))); // Do I need toString?
        } catch (err) {
            throw new PageContactError("Ticker ".concat(tick).concat(" dose not exist"));
        }


        var firstChar = split[1][0];
        // if link is a valid address...
        if (!used_urls.has(urls[i]) && firstChar >= '0' && firstChar <= '9') {
            console.log(urls[i]);
            console.log(i)
            used_urls.add(urls[i]);

            try {
                await page.goto(urls[i], { waitUntil: 'networkidle2' });  // wait for no more than 2 network connections for 500ms    
            } catch (err) {
                throw new PageContactError("page ".concat(urls[i]).concat(" either doesn't exist or there's a network connection error"));
            }


            try {
                await page.goto(urls[i], { waitUntil: 'networkidle2' });  // wait for no more than 2 network connections for 500ms    
            } catch (err) {
                throw new PageContactError("page ".concat(urls[i]).concat(" either doesn't exist or there's a network connection error"));
            }

            // await wait(150000);
            // async function wait(ms) {
            //     return new Promise(resolve => {
            //         setTimeout(resolve, ms);
            //     });
            // }

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

                    // get all the spans
                    let spans = document.querySelectorAll('span[class="priv"]');

                    let col_names = document.querySelectorAll('dt[class="column-label"]');

                    // Both on summary page
                    let mrktCap = document.querySelector('section>h1').innerText; // data-reactid="85"
                    let pe = spans[1].innerText; // data-reactid="95"
                    // Rest are on balance sheet
                    page.goto(yahoo.concat(tick.toString(10)).concat("/balance-sheet?p=").concat(tick.toString(10)));
                    let currRatio = spans[0].innerText;
                    let bv = spans[2].innerText;
                    let ltd = spans[3].innerText;
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
            if (pagedata == -1) {
                console.log(pagedata)
                continue;
            }


            console.log(pagedata['address'])


            pagedata['pageNum'] = pageNum;
            pagedata['iterationNum'] = i;
            pagedata['weblink'] = urls[i]
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

        }

        try {
            await page.goto(street.concat(tick.toString(10))); // Do I need toString?
        } catch (err) {
            throw new PageContactError("Ticker ".concat(tick).concat(" dose not exist"));
        }

    }

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