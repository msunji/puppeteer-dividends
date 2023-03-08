require('dotenv').config();
const puppeteer = require('puppeteer');

const announcements = [];
const announcement = {
  'companyName': '',
  'templateName': '',
  'formNum': '',
  'announcementUrl': '',
  'announcementTime': '',
  'circularNum': ''
}

// Puppeteer code starts here
async function scrape() {
  // Init browser - we'll do headless: false for now
  const browser = await puppeteer.launch({
    headless: true,
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
    await page.waitForSelector('tbody');

    // Iterate through each table row and go through each td cell
    const announcementData = await page.$$eval('tbody tr', rows => {
      return rows.map(row => {
        const cells = row.querySelectorAll('td'); // recall that querySelectorAll returns a nodelist NOT an array
        return Array.from(cells, cell => cell.innerHTML);
      });
    })
    console.log('table', announcementData);
    // await browser.close();
  } catch (err) {
    console.error(err);
    await browser.close();
  }
}

// Run function
scrape();