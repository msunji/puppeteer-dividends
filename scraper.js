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

  try {
    await page.$eval('input[id="tmplNm"]', templateInput => templateInput.value = "Declaration of Cash Dividends");
    // set date limits
    await page.$eval('input[name="fromDate"]', fromDate => fromDate.value = '03-01-2023');
    await page.$eval('input[name="toDate"]', toDate => toDate.value = '03-01-2023');
    await page.$eval('input[id="btnSearch"]', searchElem => searchElem.click());
    await page.waitForNavigation();
    await page.$$eval()
  } catch (err) {
    console.error(err)
  }
}

// Run function
scrape();