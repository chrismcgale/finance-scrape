const fs = require('fs');
const csvParser = require('csv-parser');
const fortunes = './constituents.csv';

function parse(){
    tickers = []
    fs.createReadStream(fortunes)
        .pipe(csvParser())
        .on('data', (row) => {
            //console.log(ticks.length);
            tickers.push(row.Symbol);
            tickers.push(row.Name);
            tickers.push(row.Sector);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });
        return tickers;
}
module.exports = parse