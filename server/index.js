/** Add Page to dates in notion
 * # Array of dates from `startDate` to `endDate`
 * |- take input form cli node?? 
 * # Notion api to add page With title - '01 Jan'24 (Mon)'
 * # Call notion api every 1 sec
 */

const { isDate } = require('node:util/types')
const { Client } = require('@notionhq/client');
const datesBetween = require('dates-between');
const notion = new Client({ auth: process.env.NOTION_KEY });
const databaseID = process.env.NDB_DAYS;

const title = (input) => {
  const date = new Date(input);
  const WEEK = ["Sunday", "Monday", "Tueday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const fDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const month = MONTHS[date.getMonth()].slice(0, 3);
  const weekDay = WEEK[date.getDay()].slice(0, 3);
  const year = date.getFullYear().toString().slice(2);
  const formattedDate = `${fDate} ${month}'${year} (${weekDay})`;
  // console.log("title ", formattedDate)
  return formattedDate;
}
//---> Edit dates here <---
dates("8/1/24", "8/31/24").forEach((date, count) => {
  setTimeout(async () => {
    if (!isDate(date)) return;
    addPage(date);
  }, count * 2000);
});

/**
 * @param {string} start 
 * @param {string} end 
 * @returns Array of date objects, includes `startDate`, `endDate`
 */
function dates(start, end) {
  const _start = new Date(start);
  const _end = new Date(end);
  return Array.from(datesBetween(_start, _end))
}

/**
 * 
 * @param {Date} date 
 */
async function addPage(date) {
  // check if page already exist
  const page = await notion.databases.query({
    database_id: databaseID,
    filter: {
      "property": "Day",
      "rich_text": {
        "contains": title(date)
      }
    },
  });

  if (page.results.length == 1) {
    console.log(`Page ${title(date)} already exists`)
  } else {
    console.log(`Adding ${title(date)} ...`)
    try {
      const response = await notion.pages.create({
        parent: { database_id: databaseID },
        icon: {
          type: 'emoji',
          'emoji': '☀️'
        },
        properties: {
          title: {
            title: [
              {
                "text": {
                  "content": title(date),
                }
              }
            ]
          },
          "Date": {
            date: {
              start: date.toISOString().slice(0, 10)
            }
          }
        }
      });
      console.log(`Success!!! ${title(date)} page created. Its url is:${response.url}`);
    } catch (error) {
      console.log(`Error: ${error.code}, Status: ${error.status}`, "\n", error.message);
    }
  }
}
