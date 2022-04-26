import algoliasearch from "algoliasearch";

const client = algoliasearch("NFWGUIPGOC", "0c5a6292ce76c6dad96abfda4a26fe0e");
export const productIndex = client.initIndex("products");
