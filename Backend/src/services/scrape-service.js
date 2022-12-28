const puppeteer = require('puppeteer');

const parse = require("./parser.js");
const write_to_file = require('./write');
const { query } = require('../query');

const yahoo = "https://finance.yahoo.com/quote/";
const dividends = "https://dividendhistory.org/payout/";
const nasdaq = "https://www.nasdaq.com/market-activity/stocks/";
const earnings = "https://www.macrotrends.net/stocks/charts/";


const getAllCompanyData = () => query().find({});

const updateCompanies = (updates) = () => query.bulkWrite(updates);

const scrapeCompanyData = async () => {
    try {
        const companyDate = await getAllCompanyData();
        let tickers = parse();

        const browser = await puppeteer.launch({
                headless: false,
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080', '--single-process', '--no-zygote']
            })

        // create new page
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(30000);

        const updates = [];

        for (i = 0; i < 1515; i += 3) {
            try {
                //Get tick and company name from constituents.csv
                const { _id, Symbol, Name, Sector } = companyData[i]...;

                // Yahoo Data
                await page.goto(yahoo.concat(Symbol), { waitUntil: 'domcontentloaded' });

                const mrktCap = await page.$selector("#quote-summary > div.Pstart\\(12px\\) > table > tbody > tr > td.Ta\\(end\\) > span");
                const pe = await page.$selector("#quote-summary > div.Pstart\\(12px\\) > table > tbody > tr:nth-child(3) > td.Ta\\(end\\) > span");

                await page.goto(`${yahoo}${Symbol}/key-statistics?p="${Symbol}`, { waitUntil: 'domcontentloaded' });

                const pbv = await page.$selector("table > tbody > tr:nth-child(7) > td:nth-child(2)").textContent;
                const currRatio =  await page.$selector("#Col1-0-KeyStatistics-Proxy > section > div.Mstart\\(a\\).Mend\\(a\\) > div:nth-child(3) > div > div:nth-child(5) > div > div > table > tbody > tr:nth-child(5) > td.Fw\\(500\\).Ta\\(end\\).Pstart\\(10px\\).Miw\\(60px\\)").innerText

                
                // NAS Data
                await page.goto(`${nasdaq}${Symbol}/financials`, { waitUntil: 'domcontentloaded' });

                // click balance sheet button
                await page.waitForSelector("body > div.dialog-off-canvas-main-canvas > div > main > div.page__content > div.quote-subdetail__content.quote-subdetail__content--new > div:nth-child(3) > div > div.quote-subdetail__indented-components > div > div.financials.financials--large-numbers > div > div.financials__heading > div.financials__controls > div > div > div > button:nth-child(2)");
                await page.click("body > div.dialog-off-canvas-main-canvas > div > main > div.page__content > div.quote-subdetail__content.quote-subdetail__content--new > div:nth-child(3) > div > div.quote-subdetail__indented-components > div > div.financials.financials--large-numbers > div > div.financials__heading > div.financials__controls > div > div > div > button:nth-child(2)");
                
                let longTermDebt = await page.$selector("body > div.dialog-off-canvas-main-canvas > div > main > div.page__content > div.quote-subdetail__content.quote-subdetail__content--new > div:nth-child(3) > div > div.quote-subdetail__indented-components > div > div.financials.financials--large-numbers > div > div.financials__body-container.loaded > div.financials__body > div.financials__panel.financials__panel--active > table > tbody > tr:nth-child(21) > td:nth-child(2)").innerText;
                longTermDebt = parseFloat(ltd.substring(1).replaceAll(',', ''));
                
                let currAssets = await page.$selector("body > div.dialog-off-canvas-main-canvas > div > main > div.page__content > div.quote-subdetail__content.quote-subdetail__content--new > div:nth-child(3) > div > div.quote-subdetail__indented-components > div > div.financials.financials--large-numbers > div > div.financials__body-container.loaded > div.financials__body > div.financials__panel.financials__panel--active > table > tbody > tr:nth-child(7) > td:nth-child(2)").innerText;
                currAssets = parseFloat(currAssets.substring(1).replaceAll(',', ''));
                
                let currLia = await page.$selector("body > div.dialog-off-canvas-main-canvas > div > main > div.page__content > div.quote-subdetail__content.quote-subdetail__content--new > div:nth-child(3) > div > div.quote-subdetail__indented-components > div > div.financials.financials--large-numbers > div > div.financials__body-container.loaded > div.financials__body > div.financials__panel.financials__panel--active > table > tbody > tr:nth-child(20) > td:nth-child(2)").innerText;
                currLia = parseFloat(currLia.substring(1).replaceAll(',', ''));
                
                const netWorkingCapital = currAssets - currLia;

                await page.goto(`${dividends}${Symbol}`, { waitUntil: 'domcontentloaded' });

                // 20 years uninterupted dividends
                const divs = [];
                for ( ;; ) {

                    const nodes = await page.$selectorAll('[role="row"]');
                    
                    document.querySelector("#dividend_table_next").click();
                    break;
                }
                await page.goto(`${earnings}${Symbol}/${company}/eps-earnings-per-share-diluted`, { waitUntil: 'domcontentloaded' });
                 
                //Increase in 3 year average EPS by at least 1/3
                //Returns list of year, eps
                let earnings = await page.$selectorAll('table > tbody > tr > td:nth-child(2)');
                //NOTE: eps is in format $X.XX
                let growth = true;
                let positive = true;
                let past = 0;
                let recent = 0;
                
                if (earnings.length < 10) return false;

                for (j = 0; j < 11; j += 1) {
                    earnings[j] = parseFloat(earnings[j].innerText.substring(1));
                    if (earnings[j] < 0) positive = false;
                }

                for (m = 0; m < 3; m += 1) recent += eps[m];
                recent /= 3;

                for (l = 8; l < 11; l += 1) past += eps[l];

                past /= 3;

                //Should be inflation adjusted, is not for now
                if (recent < past * 4 / 3) growth = false;
                return [growth, positive];

                let fin = third && !(tickers[i + 2] == "Industrials" && second[1] < 2);
                updates.push[_id, first, second, fin, netWorkingCapital < longTermDebt, fourth, fifth];
            } catch (error) {
                console.error(error);
            }
        }
        return updates;
    } catch( error) {
            console.error(error);
        };
}

module.exports = {
    getAllCompanyData,
    updateCompanies,
    scrapeCompanyData,
};

