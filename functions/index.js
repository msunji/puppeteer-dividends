const functions = require("firebase-functions");
const scraper = require("./scraper.js");
const sendemail = require("./sendemail.js");

exports.runCronJob = functions
    .pubsub.schedule("48 16 * * 1-5")
    .timeZone("Asia/Taipei")
    .onRun(() => {
      scraper()
          .then(
              (data) => {
                sendemail(data);
              })
          .catch((err) => {
            console.error(err);
          });
      return null;
    });
