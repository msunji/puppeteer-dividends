const scraper = require('./scraper.js');
const sendEmail = require('./sendEmail');

scraper()
  .then(
  data => {
    sendEmail(data)
  })
  .catch((err) => {
    console.error(err)
  }
  )