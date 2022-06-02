//Genera una compra en nuestra base de datos y además genera una orden de pago
// en MercadoPago. Devuelve una URL de MercadoPago a donde vamos a redigirigir
//al user para que pague y el orderId.

import * as yup from "yup";
import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, validateQueryAndBody } from "lib/middlewares";
import methods from "micro-method-router";
import { createOrderAndPreference } from "controllers/orders";

let querySchema = yup.object().shape({
  productId: yup.string().required(),
});

let bodySchema = yup
  .object()
  .shape({
    color: yup.string(),
    address: yup.string(),
    quantity: yup.number().required(),
  })
  .noUnknown(true)
  .strict();

export async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  token
) {
  const order = await createOrderAndPreference({
    userId: token.userId,
    productId: req.query.productId as string,
    additionalInfo: req.body,
  });
  res.send(order);
}

const handler = methods({
  post: postHandler,
});

const auth = authMiddleware(handler);

// const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
//   await corsMiddleware(
//     req,
//     res,
//     validateQueryAndBody(bodySchema, querySchema, auth)
//   );
// };

export default validateQueryAndBody(bodySchema, querySchema, auth);
