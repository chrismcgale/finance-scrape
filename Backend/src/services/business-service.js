const fs = require('fs');

const { queryPromise } = require('../db');

const getBusiness = async (id) => {
    let sql;
    try {
        sql = await fs.promises.readFile(
            './src/sql/getBusiness.sql', 'utf-8',
        );
    } catch (err) {
        console.error(`Failed to read sql file: ${err}`);
        throw err;
    }

    try {
        const business = await queryPromise(sql, [id]);
        return business.rows[0];
    } catch (err) {
        console.error(`SQL query error: ${err.message}`);
    }
};

const createBusiness = async (data) => {
    let sql;
    try {
        sql = await fs.promises.readFile(
            './src/sql/postBusiness.sql', 'utf-8',
        );
    } catch (err) {
        console.error(`Failed to read sql file: ${err}`);
        throw err;
    }

    const params = [
        data.address, 
        data.city,  
        data.province,
        data.country, 
        data.lat, 
        data.long 
    ]

    try {
        const businessID = await queryPromise(sql, params);
        return businessID.rows[0];
    } catch (err) {
        console.error(`SQL query error: ${err.message}`);
    }
};

const updateBusiness = async (id, data) => {
    let sql;
    try {
        sql = await fs.promises.readFile(
            './src/sql/updateBusiness.sql', 'utf-8',
        );
    } catch (err) {
        console.error(`Failed to read sql file: ${err}`);
        throw err;
    }

    const params = [
        id,
        data.address, 
        data.city,  
        data.province,
        data.country, 
        data.lat, 
        data.long 
    ]

    try {
        const business = await queryPromise(sql, params);
        return business.rows[0];
    } catch (err) {
        console.error(`SQL query error: ${err.message}`);
    }
};

const deleteBusiness = async (id) => {
    let sql;
    try {
        sql = await fs.promises.readFile(
            './src/sql/updateBusiness.sql', 'utf-8',
        );
    } catch (err) {
        console.error(`Failed to read sql file: ${err}`);
        throw err;
    }

    try {
        const result = await queryPromise(sql, [id]);
        return result;
    } catch (err) {
        console.error(`SQL query error: ${err.message}`);
    }
};

module.exports = {
    getBusiness,
    createBusiness,
    updateBusiness,
    deleteBusiness,
};
