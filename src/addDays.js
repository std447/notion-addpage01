// Add Pages to notion database as Dates
const { Client } = require('@notionhq/client');
const datesBetween = require('dates-between');

const notion = new Client({ auth: process.env.NOTION_KEY });
const NDB_ID = process.env.NDB_DAYS;

const startDate = new Date('2023-12-31');
const endDate = new Date('2024-01-03');

const WEEKDAYS = ["Sunday", "Monday", "Tueday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

for (const date of datesBetween(startDate, endDate)) {

  const weekDay = WEEKDAYS[date.getDay()].slice(0, 3);
  const month = MONTHS[date.getMonth()].slice(0, 3);
  const formattedDate = `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()} ${month}'${date.getFullYear().toString().slice(2)} (${weekDay})` // 24 Nov'23 (Fri)

  setTimeout(() => { addPage(formattedDate, date) }, 1000);

}

// Notion APIs
/**
 * 
 * @param {string} title - Title of page
 * @param {[object Date]} date - date of page
 * @returns 
 */
async function addPage(title, date) {
  console.log("Date", date.toISOString())
  const isAdded = await isEntryAdded(date);
  if (isAdded) return console.log(`${title} page already added`)
  const res = await notion.pages.create({
    parent: { database_id: NDB_ID },
    icon: {
      type: 'emoji',
      'emoji': '☀️'
    },
    properties: {
      title: {
        title: [
          {
            "text": {
              "content": title,
            }
          }
        ]
      },
      "Date": {
        date: {
          start: date.toISOString().slice(0, 10),
        }
      }
    }
  });

  console.log(res)
}

/** 
 * 
 * @param {Date Object} date 
 * @returns boolean
 */
async function isEntryAdded(date) {
  if (!isDate(date)) throw Error('Not date object. Please input in proper date object format');
  const res = await notion.databases.query({
    database_id: NDB_ID,
    filter: {
      property: "Date",
      "date": {
        equals: date.toISOString().slice(0, 10),
      }
    }
  });

  if (res.results.length == 0) return false;
  return true;
}

function isDate(input) {
  if (Object.prototype.toString.call(input) === "[object Date]") return true;
  return false;
}
