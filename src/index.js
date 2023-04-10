({ ...envs } = process.env); // Assigning variables in .env file to envs object

const { Client } = require('@notionhq/client');
const notion = new Client({ auth: envs.NOTION_KEY });
const databaseID = envs.NOTION_DATABASE_ID;
const today = new Date();
const weekDay = ["Sunday","Monday","Tueday","Wednesday","Thursday","Friday","Saturday"];
const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function short(txt){
    if (txt ?? "") return txt.slice(0,3);
    return "";
    }

const _weekDay = short(weekDay[today.getDay()]);//short weekday
const _date = today.getDate();
const _month = short(month[today.getMonth()]);
const _year = today.getFullYear().toString().slice(2); //last two digits of year

const pageTitle = `${_date} ${_month}'${_year}(${_weekDay})` // eg . '11 Feb'23(Tue);
// console.log(pageTitle);
// console.log(today.toISOString().slice(0,10));
async function addItem(text) {
    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseID },
            properties: {
                title: {
                    title: [
                        {
                            "text": {
                                "content": text,
                            }
                        }
                    ]
                },
                "Date":{
                    date:{
                        start:`${today.toISOString().slice(0,10)}`,
                    }
                }
            },
        })
        console.log(response)
        console.log("Success! Entry added.")
    } catch (error) {
        console.error(error.body)

    }
}

addItem(pageTitle);