const scraper = require('./scraper/scraper.js');
const sendEmail = require('./utils/sendEmail.js');

scraper()
  .then(
  data => {
    sendEmail(data)
  })
  .catch(
    console.error
  )