import * as yup from "yup";

import type { NextApiRequest, NextApiResponse } from "next";
import { getProducById } from "controllers/products";
import methods from "micro-method-router";
import { validateQuery } from "lib/middlewares";

let querySchema = yup
  .object()
  .shape({
    productId: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

export async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const product = await getProducById(req.query.productId as string);
  res.send(product);
}

const handler = methods({
  get: getHandler,
});

// const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
//   await corsMiddleware(req, res, validateQuery(querySchema, handler));
// };

export default validateQuery(querySchema, handler);
