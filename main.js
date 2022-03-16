const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://calorieninjas.com/api');
    let count = 0;
    page.on('response', async (response) => {    
        if (response.url().startsWith('https://api.calorieninjas.com/v1/nutrition')){
            if(count == 1) { 
                let element = await page.$('#sample-response')
                let value = await element.evaluate(el => el.textContent)
                res.json(JSON.parse(value))
                browser.close();
            }
            count++
        } 
    }); 
    await page.$eval('#sample-api-request', el => el.value = '');
    await page.type('#sample-api-request', req.query.query)
    await page.click('#submitSampleAPIRequest')
})

app.listen(port, () => {
    console.log(`API listening on port ${port}`)
});