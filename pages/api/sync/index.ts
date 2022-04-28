import { syncOrders } from "controllers/orders";
import { syncProducts } from "controllers/products";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await syncProducts();
    await syncOrders();
    res.send("finish");
  } catch (error) {
    res.send(error);
  }
}
