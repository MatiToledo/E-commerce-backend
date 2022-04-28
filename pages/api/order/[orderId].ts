// Devuelve una orden con toda la data incluyendo el estado de la orden.

import * as yup from "yup";
import type { NextApiRequest, NextApiResponse } from "next";
import { validateQuery } from "lib/middlewares";
import methods from "micro-method-router";
import { getOrderById } from "controllers/orders";

let querySchema = yup
  .object()
  .shape({
    orderId: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

export async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const order = await getOrderById(req.query.orderId as string);
  res.send(order);
}

const handler = methods({
  get: getHandler,
});

export default validateQuery(querySchema, handler);
