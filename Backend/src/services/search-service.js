const fs = require('fs');

const geohash = require('ngeohash');

const { queryPromise } = require('../db');

const precision = 6;

const searchBusinessesDefault = async (lat, long) => {
    let sql;
    try {
        sql = await fs.promises.readFile(
            './src/sql/searchBusinessesDefault.sql', 'utf-8',
        );
    } catch (err) {
        console.error(`Failed to read sql file: ${err}`);
        throw err;
    }

    const hash = geohash.encode(lat, long, precision);

    const neighbors = geohash.neighbors(geohash);

    try {
        const business = await queryPromise(sql, neighbors);
        return business.rows[0];
    } catch (err) {
        console.error(`SQL query error: ${err.message}`);
    }
};

const searchBusinessesByRadius = async (lat, long) => {
    let sql;
    try {
        sql = await fs.promises.readFile(
            './src/sql/searchBusinessesByRadius.sql', 'utf-8',
        );
    } catch (err) {
        console.error(`Failed to read sql file: ${err}`);
        throw err;
    }

    // find min/max lat/long

    const hash = geohash.encobboxesde(lat, long, precision);

    try {
        const business = await queryPromise(sql, neighbors);
        return business.rows[0];
    } catch (err) {
        console.error(`SQL query error: ${err.message}`);
    }
};

module.exports = {
    searchBusinessesDefault,
    searchBusinessesByRadius
};
