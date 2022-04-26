import type { NextApiRequest, NextApiResponse } from "next";

import { airtableBase } from "./../../../lib/airtable";
import { productIndex } from "./../../../lib/algolia";

export default function (req: NextApiRequest, res: NextApiResponse) {
  airtableBase("Products")
    .select({
      pageSize: 10,
    })
    .eachPage(
      async function (records, fetchNextPage) {
        const objects = records.map((r) => {
          return {
            objectID: r.fields.Code,
            ...r.fields,
          };
        });
        await productIndex.saveObjects(objects);
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.log(err);
          return;
        }
        res.send("termino");
      }
    );
}
