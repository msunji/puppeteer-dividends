require('dotenv').config();
const puppeteer = require('puppeteer');

// Puppeteer code starts here
async function scrape() {
  // Init browser
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
    await page.goto(process.env.PSE_NEWS, { waitUntil: 'domcontentloaded' });

    // Get results table text
    await page.waitForSelector('tbody');

    // Iterate through each table row and go through each td cell
    const announcementLinks = await page.$$eval('tbody tr', rows => {
      // Filter rows (must have more than one cell) and then map through cells and get viewer links per row
      return rows.filter(row => {
        return row.querySelectorAll('td').length > 1;
      }).map(row => {
        const cells = row.querySelectorAll('td');
        return `https://edge.pse.com.ph/openDiscViewer.do?edge_no=${cells[1].childNodes[0].getAttribute('onclick').split("'")[1]}`;
      });
    })

    console.log(announcementLinks);

    const announcementData = [];

    if (announcementLinks.length) {
      for (const link of announcementLinks) {
        await page.goto(link, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#viewHeader');
        await page.waitForSelector('#viewBody');

        const company = await page.$eval('#viewHeader h2', elem => elem.innerText);
        const announcementDate = await page.$eval('#viewHeader p', elem => elem.innerText.split(': ')[1]);

        const announcement = {
          'company': company,
          'announcementDate':  announcementDate
        }

        announcementData.push(announcement);
      }
    } else {
      return console.log('Nothing new to announce')
    }

    console.log(announcementData);
    // await browser.close();
  } catch (err) {
    console.error(err);
    await browser.close();
  }
}

// Run function
scrape();