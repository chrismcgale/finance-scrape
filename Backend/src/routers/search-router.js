const express = require('express');

const { StatusCode } = require('../enums');

const router = new express.Router();

const searchService = require('../services/search-service');

router.get('/search', async (req, res) => {
    try {
        const { lat, long } = req.body;
        try {
            if (Number.isNaN(lat) || lat < 0 || Number.isNaN(long) || long < 0 ) throw new invalidID();
        } catch (invalidID) {
            return res.status(StatusCode.BadRequest);  
        }
        const businesses = await searchService.searchBusinessesDefault(lat, long);
        return res.status(StatusCode.OK).send(businesses);
    } catch (err) {
        res.status(StatusCode.BadRequest).send({ error: err.message });
    }
});

router.get('/search/:radius', async (req, res) => {
    try {
        const { lat, long } = req.body;
        try {
            if (Number.isNaN(lat) || lat < 0 || Number.isNaN(long) || long < 0 || (radius && (Number.isNaN(radius) || radius < 0))) throw new invalidID();
        } catch (invalidID) {
            return res.status(StatusCode.BadRequest);  
        }
        const businesses = await searchService.searchBusinessesByRadius(lat, long, radius);
        return res.status(StatusCode.OK).send(businesses);
    } catch (err) {
        res.status(StatusCode.BadRequest).send({ error: err.message });
    }
});