import { productIndex } from "lib/algolia";
import { airtableBase } from "lib/airtable";

export async function getPagination(q, limit, offset) {
  const results = await productIndex.search((q as string) || "", {
    length: limit,
    offset,
  });
  return {
    results: results.hits,
    pagination: {
      offset,
      limit,
      total: results.nbHits,
    },
  };
}

export async function getProducById(id: string) {
  const product = await productIndex.getObject(id);
  return product;
}

export async function getProducByType(type: string) {
  const results: any = await productIndex.search("", {
    hitsPerPage: 1000,
  });

  const products = [];
  for (const p of results.hits) {
    console.log(p.Type);

    if (p.Type == type) {
      products.push(p);
    }
  }
  return { products, nbHits: products.length };
}

export async function syncProducts() {
  try {
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
        }
      );
    return true;
  } catch (error) {
    return error;
  }
}
