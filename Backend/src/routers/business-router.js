const express = require('express');

const { StatusCode } = require('../enums');

const router = new express.Router();

const businessService = require('../services/business-service');

router.get('/business/:id', async (req, res) => {
    try {
        const { id } = req.params;
        try {
            if (Number.isNaN(id) || id < 0) throw new invalidID();
        } catch (invalidID) {
            return res.status(StatusCode.BadRequest);  
        }
        const business = await businessService.getBusiness(id);
        try {
            if (!business) throw new unknownID();
        } catch (unknownID) {
            return res.status(StatusCode.NotFound);
        } 
        return res.status(StatusCode.OK).send(business);
    } catch (err) {
        res.status(StatusCode.BadRequest).send({ error: err.message });
    }
});

router.post('/business', async (req, res) => {
    try {
        const { businessData } = req.body;
        try {
            if (Number.isNaN(id) || id < 0) throw new invalidID();
        } catch (invalidID) {
            return res.status(StatusCode.BadRequest);  
        }
        const businessID = await businessService.createBusiness(businessData);
        return res.status(StatusCode.OK).send(businessID);
    } catch (err) {
        res.status(StatusCode.BadRequest).send({ error: err.message });
    }
});

router.put('/business/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { businessData } = req.body;
        try {
            if (Number.isNaN(id) || id < 0) throw new invalidID();
        } catch (invalidID) {
            return res.status(StatusCode.BadRequest);  
        }
        const business = await businessService.updateBusiness(id, businessData);
        try {
            if (!business) throw new unknownID();
        } catch (unknownID) {
            return res.status(StatusCode.NotFound);
        } 
        return res.status(StatusCode.OK).send(business);
    } catch (err) {
        res.status(StatusCode.BadRequest).send({ error: err.message });
    }
});

router.delete('/business/:id', async (req, res) => {
    try {
        const { id } = req.params;
        try {
            if (Number.isNaN(id) || id < 0) throw new invalidID();
        } catch (invalidID) {
            return res.status(StatusCode.BadRequest);  
        }
        await businessService.deleteBusiness(id);
        return res.status(StatusCode.OK);
    } catch (err) {
        res.status(StatusCode.BadRequest).send({ error: err.message });
    }
});

module.exports = router;