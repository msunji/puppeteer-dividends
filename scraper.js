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

  // Abort requests for images on PSE Edge
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (req.resourceType() === 'image') {
      req.abort();
    } else {
      req.continue();
    }
  })

  // Go to PSE Edge Company Announcements page
  // await page.setDefaultNavigationTimeout(0);
  await page.goto(process.env.PSE_NEWS, { waitUntil: 'domcontentloaded' });

  try {
    // Make search more specific - we're looking for dividend declarations
    await page.$eval('input[id="tmplNm"]', templateInput => templateInput.value = "Declaration of Cash Dividends");
    // Set fixed date
    await page.$eval('input[name="fromDate"]', fromDate => fromDate.value = '03-01-2023');
    await page.$eval('input[name="toDate"]', toDate => toDate.value = '03-01-2023');

    // Click search button
    await page.$eval('input[id="btnSearch"]', searchElem => searchElem.click());

    await page.waitForNavigation({ waitUntil: 'load' });
    await page.waitForSelector('tbody');
    const table = await page.$$eval('tbody tr', tr => tr.map(tr => {
      return tr.innerHTML;
    }))
    console.log('table', table);
    // await browser.close();
  } catch (err) {
    console.error(err);
    // await browser.close();
  }
}

// Run function
scrape();