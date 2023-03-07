require('dotenv').config();
const puppeteer = require('puppeteer');

// Puppeteer code starts here
async function scrape() {
  // Init browser - we'll do headless: false for now
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });
  const page = await browser.newPage();

  // Config nav timeout
  // Failure to set this leads to timeout when loading PSE Edge
  await page.setDefaultNavigationTimeout(0);
  await page.goto(process.env.PSE_NEWS);
}

// Run function
scrape();