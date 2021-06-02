const fs = require('fs');

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

module.exports = write_to_file