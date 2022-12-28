const express = require('express');

const { StatusCode } = require('../enums');

const router = new express.Router();

const scrapeService = require('../services/scrape-service');

router.get('/companies', async (req, res) => {
    try {
        const companies = await scrapeService.getAllCompanyData(id);
        return res.status(StatusCode.OK).send(companies);
    } catch (err) {
        res.status(StatusCode.BadRequest).send({ error: err.message });
    }
});

 module.exports = router;
