import * as yup from "yup";

import type { NextApiRequest, NextApiResponse } from "next";

import { getOffsetAndLimit } from "lib/requests";
import { productIndex } from "../../../lib/algolia";
import { getPagination } from "controllers/products";

let querySchema = yup
  .object()
  .shape({
    q: yup.string(),
    limit: yup.string(),
    offset: yup.string(),
  })
  .noUnknown(true)
  .strict();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await querySchema.validate(req.query);
  } catch (error) {
    res.status(406).send({ field: "query", message: error });
  }

  const { limit, offset } = getOffsetAndLimit(req);
  const pagination = await getPagination(req.query.q, limit, offset);
  res.send(pagination);
}
