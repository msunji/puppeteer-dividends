const scraper = require('./scraper.js');
const sendEmail = require('./sendEmail');

scraper()
  .then(
  data => {
    sendEmail(data)
  })
  .catch(
    console.error
  )