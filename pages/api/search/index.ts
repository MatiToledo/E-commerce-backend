import * as yup from "yup";

import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getOffsetAndLimit } from "lib/requests";
import { getPagination } from "controllers/products";
import { validateQuery } from "lib/middlewares";

let querySchema = yup
  .object()
  .shape({
    q: yup.string(),
    limit: yup.string(),
    offset: yup.string(),
  })
  .noUnknown(true)
  .strict();

export async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const { limit, offset } = getOffsetAndLimit(req);
  const pagination = await getPagination(req.query.q, limit, offset);
  res.send(pagination);
}

const handler = methods({
  get: getHandler,
});

export default validateQuery(querySchema, handler);
