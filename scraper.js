require('dotenv').config();
const puppeteer = require('puppeteer');

// Puppeteer code starts here
async function scraper() {
  // Init browser
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null
  });

  // Get today's date in this format: MM-DD-YYYY
  // This gets passed as a param to the URL we pass to Puppeteer
  let dateTodayArr = new Date().toISOString().slice(0,10).split('-');
  let parsedDateToday = [...dateTodayArr.slice(1), dateTodayArr[0]].join('-');

  let announcementData = [];

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
    await page.goto(`${process.env.PSE_NEWS}&fromDate=${parsedDateToday}&toDate=${parsedDateToday}`, { waitUntil: 'domcontentloaded' });

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

    if (announcementLinks.length) {
      for (const link of announcementLinks) {
        await page.goto(link, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#viewHeader, #viewBody, iframe[id="viewContents"]');

        // Get company name and announcement date from news item specific page on viewer
        const company = await page.$eval('#viewHeader h2', elem => elem.innerText);
        const announcementDate = await page.$eval('#viewHeader p', elem => elem.innerText.split(': ')[1]);

        // Target elements in iframe
        const detailsFrame = await page.$('iframe[id="viewContents"]');
        const detailsContent = await detailsFrame.contentFrame();

        // Get ex-date
        const exDate = await detailsContent.$eval('#remarkContents span', elem => elem.innerText.split(': ')[1]);

        // Table containing dividend information doesn't have an id specified, so we'll use Xpath
        const getCellValue = async (cellLabel) => {
          const [selectedCell] = await detailsContent.$x(`//th[contains(text(),"${cellLabel}")]/following-sibling::td[1]`);
          const value = await selectedCell.evaluate(el => el.textContent);
          return value;
        };

        // Get values for:
        // Dividend Type, Amount of Cash div per share, record date and payment datae
        const typeVal = await getCellValue('Type (Regular or Special)');
        const amount = await getCellValue('Amount of Cash Dividend Per Share');
        const recordDate = await getCellValue('Record Date');
        const paymentDate = await getCellValue('Payment Date');

        const announcement = {
          company,
          announcementDate,
          typeVal,
          amount,
          exDate,
          recordDate,
          paymentDate
        }
        announcementData.push(announcement);
      }
    } else {
      return console.log('Nothing new to announce');
    }
    // console.log(announcementData);
    return announcementData;
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}

module.exports = scraper;