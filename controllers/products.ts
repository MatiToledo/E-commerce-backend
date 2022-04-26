import { productIndex } from "lib/algolia";

export async function getPagination(q, limit, offset) {
  const results = await productIndex.search((q as string) || "", {
    hitsPerPage: limit,
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
