/** Express helps with htpp requests */
const express = require('express');

const cron = require('node-cron');

const searchRouter = require('./src/routers/search-router');
const businessRouter = require('./src/routers/business-router');
const { updateCompanies, scrapeCompanyData } = require('./src/services/scrape-service');

const port = process.env.PORT || 3000;
const app = express();

app.use(searchRouter);
app.use(businessRouter);

app.listen(port, () => logger.info(`server running on port ${port}`));

// run scrape every morning 10am
cron.schedule('* 10 * * *', () => {
    try {
        const updates = scrapeCompanyData();
        updateCompanies(updates);
    } catch (err) {
        console.log('Fin Scrape cron error')
    }
});