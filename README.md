# Dividend News
A web scraper built with Puppeteer and Node.js that routinely checks Philippine Stock Market (PSE) Edge for any dividend announcements.

## What is this for?
This tool helps keep track of PSE cash dividend announcements. Instead of having to manually check the PSE Edge Company Announcements page daily, this tool scrapes the page for relevant announcements and sends the results through email.

Announcements are generally made on weekdays and during trading hours - often in the afternoon, from what I've noticed. As such, the script is run around the end of trading hours.

## V1 Notes
In the first iteration, I'd like this scraper to function like so:
- [x] Set up Puppeteer script to go to the **Company Announcements** page on PSE Edge
- [x] Only show results for Dividend Announcements (the "Template Name" is called **Declaration of Cash Dividends**)
- [x] Set search results to a specific time (fixed date for now, should change this later so it checks for day-of announcements)
- [x] Collect relevant dividend announcement data/content from PSE Edge's news viewer
  - More details about the dividend announcement can be accessed by clicking on a popup that shows details like: type of dividend, amount of cash dividend per share, etc.
  - Data that needs to be collected are:
    - Company Name
    - Announcement Date
    - Type of Securities
    - Amount of Cash Dividend per Share
    - Ex-Date
    - Record Date
    - Payment Date
- [x] Run the scraper at the end of a trading day
  - **Note:** At this point, I run the script myself in the afternoon. In V2, I'd like to turn this into a cron job and have it run on weekdays at a set time.
- [x] Compile results and email them to myself and the investor relation division.

## Moving Forward: V2
In V2, this should:
- [ ] Set up a database for the data
- [ ] Send out alerts to recipients when ex-date approaches (t-1 day)
- [ ] Run scraper as a cron job

## Credit/Resources
I learned a lot doing this project and found these really helpful.
- [Responsive HTML Email Template](https://github.com/leemunroe/responsive-html-email-template) - This simplified the email template by a lot. Phew. Who knew HTML email templates were so tedious?
- [crontab guru](https://crontab.guru/) - Helps you write cron schedule expressions