// Devuelve todas mis ordenes con sus status.

import * as yup from "yup";
import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, validateBody } from "lib/middlewares";
import { getOrdersByUserId } from "controllers/orders";

let bodySchema = yup
  .object()
  .shape({
    email: yup.string(),
    address: yup.string(),
  })
  .noUnknown(true)
  .strict();

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const orders = await getOrdersByUserId(token.userId);
  res.status(200).send(orders);
}

const handler = methods({
  get: getHandler,
});

const auth = authMiddleware(handler);

// const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
//   await corsMiddleware(req, res, validateBody(bodySchema, auth));
// };

export default validateBody(bodySchema, auth);
