# Dividend News
A web scraper built with Puppeteer and Node.js that routinely checks Philippine Stock Market (PSE) Edge for any dividend announcements.

## What is this for?
I'm currently learning how to manage a stock portfolio in my free time and have been wanting to keep track of companies making cash dividend announcements. Instead of having to manually check PSE Edge everyday, I decided I'd write a simple tool to scrape this data at a set time during the week and have the data sent to me through email.

Currently, in this first iteration, I'd like this scraper to function like so:
- [x] Set up Puppeteer script to go to the **Company Announcements** page on PSE Edge
- [x] Only show results for Dividend Announcements (the "Template Name" is called **Declaration of Cash Dividends**)
- [ ] Set search results to a specific time (fixed date for now, should change this later so it checks for day-of announcements)
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
- [ ] Run the scraper at the end of a trading day
- [ ] Compile results and email them to myself

## Moving Forward
In a future iteration, I'd like to:
- [ ] Set some sort of database for it so I have historical data to look back on and reference
- [ ] Run the scraper more than once a day.