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

    // console.log(announcementLinks);

    const announcementData = [];

    if (announcementLinks.length) {
      for (const link of announcementLinks) {
        await page.goto(link, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#viewHeader, #viewBody, iframe[id="viewContents"]');

        // Get company name and announcement date from news item specific page on viewer
        const company = await page.$eval('#viewHeader h2', elem => elem.innerText);
        const announcementDate = await page.$eval('#viewHeader p', elem => elem.innerText.split(': ')[1]);

        const detailsFrame = await page.$('iframe[id="viewContents"]');
        const detailsContent = await detailsFrame.contentFrame();

        // Table containing dividend information doesn't have an id specified, so we'll use Xpath

        // const testFunc = () => {
        //   return console.log('hello test');
        // }
        // Type of Dividend
        const [typeTr] = await detailsContent.$x('//th[contains(text(),"Type (Regular or Special)")]/following-sibling::td[1]/descendant::span');
        const typeVal = await typeTr.evaluate(el => el.textContent);

        // Amount of Cash per Dividend per Share
        const [amountTr] = await detailsContent.$x('//th[contains(text(),"Amount of Cash Dividend Per Share")]/following-sibling::td[1]/descendant::span');
        const amountVal = await amountTr.evaluate(el => el.textContent);

        // Payment Date
        const [paymentTr] = await detailsContent.$x('//th[contains(text(),"Payment Date")]/following-sibling::td[1]/descendant::span');
        const paymentVal = await paymentTr.evaluate(el => el.textContent);


        // testFunc();
        const announcement = {
          'company': company,
          'announcementDate':  announcementDate,
          'type': typeVal,
          'amount': amountVal,
          'payment': paymentVal
        }
        announcementData.push(announcement);
      }
    } else {
      return console.log('Nothing new to announce');
    }

    console.log(announcementData);
    await browser.close();
  } catch (err) {
    console.error(err);
    await browser.close();
  }
}

// Run function
scrape();