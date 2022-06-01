import * as yup from "yup";

import type { NextApiRequest, NextApiResponse } from "next";
import { getProducById, getProducByType } from "controllers/products";
import methods from "micro-method-router";
import { validateQuery } from "lib/middlewares";

let querySchema = yup
  .object()
  .shape({
    type: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

export async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const products = await getProducByType(req.query.type as string);
  res.send(products);
}

const handler = methods({
  get: getHandler,
});

export default validateQuery(querySchema, handler);
