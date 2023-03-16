const functions = require("firebase-functions");

exports.runCronJob = functions
    .pubsub.schedule("35 16 * * 1-5")
    .timeZone("Asia/Taipei")
    .onRun(() => {
      return console.log("This runs at 16.35 Monday to Friday");
    });
