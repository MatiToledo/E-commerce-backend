import Airtable from "airtable";

export const airtableBase = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN,
}).base("appFtoWohAPvcManq");
