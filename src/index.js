({ ...envs } = process.env); // Assigning variables in .env file to envs object

const { Client } = require('@notionhq/client');
const notion = new Client({ auth: envs.NOTION_KEY });
const databaseID = envs.NOTION_DATABASE_ID;
console.log("@CC", databaseID)

// Generating title from date
const today = new Date();
const weekDay = ["Sunday", "Monday", "Tueday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/***
 * 
 */
function short(txt) {
    if (txt ?? "") return txt.slice(0, 3);
    return "";
}

const _weekDay = short(weekDay[today.getDay()]);//short weekday
const _date = today.getDate();
const _month = short(month[today.getMonth()]);
const _year = today.getFullYear().toString().slice(2); //last two digits of year

const pageTitle = `${_date} ${_month}'${_year}(${_weekDay})` // eg . '11 Feb'23(Tue);
// console.log(pageTitle);
// console.log(today.toISOString().slice(0,10));
export async function addItem(text) {
    const isEntry = await isEntryAdded();
    console.log("@Cc 30", { isEntry });
    if (!isEntry) {
        console.log("Added following entry ---")
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
                    "Date": {
                        date: {
                            start: `${today.toISOString().slice(0, 10)}`,
                        }
                    }
                },
                children: [
                    {
                        object: "block",
                        type: "heading_2",
                        heading_2: {
                            rich_text: [
                                {
                                    type: "text",
                                    text: {
                                        content: "Hearing"
                                    },
                                    annotations: {
                                        bold: false,
                                        italic: false,
                                        strikethrough: false,
                                        underline: false,
                                        code: false,
                                        color: 'blue'
                                    },
                                    plain_text: "Hearing",
                                    href: null
                                },

                            ]
                        }
                    },
                    {
                        object: "block",
                        type: "heading_2",
                        heading_2: {
                            rich_text: [
                                {
                                    type: "text",
                                    text: {
                                        content: "Reading"
                                    },
                                    annotations: {
                                        bold: false,
                                        italic: false,
                                        strikethrough: false,
                                        underline: false,
                                        code: false,
                                        color: 'blue'
                                    },
                                    plain_text: "Reading",
                                    href: null
                                },

                            ]
                        }
                    },
                    {
                        object: "block",
                        type: "heading_2",
                        heading_2: {
                            rich_text: [
                                {
                                    type: "text",
                                    text: {
                                        content: "Journaling"
                                    },
                                    annotations: {
                                        bold: false,
                                        italic: false,
                                        strikethrough: false,
                                        underline: false,
                                        code: false,
                                        color: 'blue'
                                    },
                                    plain_text: "Journaling",
                                    href: null
                                },

                            ]
                        }
                    }
                ]
            })
            console.log(response)
            console.log("Success! Entry added.")
        } catch (error) {
            console.error(error.body)

        }
    } else {
        console.log("Entry added")
    }
}

addItem(pageTitle);

async function isEntryAdded() {
    const res = await notion.databases.query({
        database_id: databaseID,
        filter: {
            "property": "Date",
            "date": {
                "equals": today.toISOString().slice(0, 10),
            }
        }
    });
    const results = res.results;


    if (results.length == 0) {
        console.log(results)
        return false;
    }
    console.log(results[0]);

    return true;

}



// (async () => {
//     const blockId = 'e0289d5ab9574a2d86a3794785105e09';
//     const response = await notion.blocks.children.list({
//       block_id: blockId,
//       page_size: 50,
//     });
//     console.log("response",response.results,"---");
//     console.log("response.results[0].heading",response.results[0]['heading_2'],"---");
//     console.log("response.results[0].heading.richtext",response.results[0]['heading_2']['rich_text']);
//   })();

//   https://www.notion.so/dev108/2-May-23-Tue-e0289d5ab9574a2d86a3794785105e09?pvs=4