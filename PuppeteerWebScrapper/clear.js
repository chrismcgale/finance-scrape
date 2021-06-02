const fs = require('fs');

function clear() {
    fs.writeFile('./data.csv', '', function (err) {
        if (err) throw err;
    });
    let string = "Name,Market-Cap,Price-to-Earnings,Price-to-Book,Current-Ratio,Financial-Position,Uninterupted-Divs,Ten-year-growth,No-Earnings-Deficit" + '\n';
    fs.appendFile('./data.csv', string, function (err) {
        if (err) throw err;
    });
}

module.exports = clear