import { listenMerchantOrder } from "controllers/orders";
import { validateQuery } from "lib/middlewares";
import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

let querySchema = yup
  .object()
  .shape({
    id: yup.string().required(),
    topic: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

export async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const order = await listenMerchantOrder(req.query.id, req.query.topic);
  res.send(order);
}

const handler = methods({
  post: postHandler,
});

export default validateQuery(querySchema, handler);
