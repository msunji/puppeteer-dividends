const scraper = require('./functions/scraper');
const sendemail = require('./functions/sendemail');

scraper()
  .then(
  data => {
    sendemail(data);
  })
  .catch((err) => {
    console.error(err);
  })