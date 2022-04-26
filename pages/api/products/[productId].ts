import * as yup from "yup";

import type { NextApiRequest, NextApiResponse } from "next";
import { getProducById } from "controllers/products";

let querySchema = yup
  .object()
  .shape({
    productId: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await querySchema.validate(req.query);
  } catch (error) {
    res.status(406).send({ field: "query", message: error });
  }
  const product = await getProducById(req.query.productId as string);
  res.send(product);
}
