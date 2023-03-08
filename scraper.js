require('dotenv').config();
const puppeteer = require('puppeteer');

// Puppeteer code starts here
async function scrape() {
  // Init browser - we'll do headless: false for now
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });

  try {
    const page = await browser.newPage();

    // Abort requests for images on PSE Edge
    await page.setRequestInterception(true);
    page.on('request', req => {
      if (req.resourceType() === 'image') {
        req.abort();
      } else {
        req.continue();
      }
    })
    // Go to search results for dividend announcements given set time
    await page.setDefaultNavigationTimeout(0);
    await page.goto(process.env.PSE_NEWS, { waitUntil: 'networkidle2' });

    // Get results table text
    const results = await page.waitForSelector('tbody');
    console.log(results);
    const table = await page.$$eval('tbody', tr => tr.map(tr => {
      return tr.innerHTML;
    }))
    console.log('table', table);
    // await browser.close();
  } catch (err) {
    console.error(err);
    await browser.close();
  }
}

// Run function
scrape();