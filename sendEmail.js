require('dotenv').config();
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// Get email template from templates directory
const emailTemplate = fs.readFileSync(path.join(__dirname, '/templates/email.handlebars'), 'utf-8');

function sendEmail(dataObj) {
  // Set up transporter object
  // Using Sendgrid for this one
  let transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API
    }
  });

  // Us the Handlebars template we made earlier
  const template = handlebars.compile(emailTemplate);
  // Pass the data to the handlebars template
  const msgBody = (template({ "data": dataObj }));

  // Send mail!
  transporter.sendMail({
    from: `Marge Consunji <${process.env.SENDER_EMAIL}>`,
    to: process.env.SENDER_EMAIL,
    subject: "Dividend Updates",
    text: "These are today's updates",
    html: msgBody
  }), function(err, info) {
    if (err) {
      console.error(err)
    } else {
      console.log('Email sent: ' + info.response)
    }
  }
}

module.exports = sendEmail;