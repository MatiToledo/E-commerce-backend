// Devuelve todas mis ordenes con sus status.

import * as yup from "yup";
import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { getUserData } from "controllers/users";
import { User } from "models/user";
import { Auth } from "models/auth";
import { getOrdersByUserId } from "controllers/orders";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const orders = await getOrdersByUserId(token.userId);
  res.status(200).send(orders);
}

let bodySchema = yup
  .object()
  .shape({
    email: yup.string(),
    address: yup.string(),
  })
  .noUnknown(true)
  .strict();

async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
  try {
    await bodySchema.validate(req.body);
  } catch (error) {
    res.status(406).send({ field: "body", message: error });
  }
  const user = await User.modifyData(req.body, token.userId);
  if (req.body.email) {
    console.log("Voy a cambiar el email de auth");
    const auth = await Auth.modifyAuthEmail(req.body.email, token.userId);
  }

  res.status(200).send(user);
}

const handler = methods({
  get: getHandler,
});

export default authMiddleware(handler);
