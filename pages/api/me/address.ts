//Permite modificar un dato puntual del usuario al que pertenezca el token
//usado en el request. En este caso el objeto que describe la dirección.

import * as yup from "yup";
import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { getUserData } from "controllers/users";
import { User } from "models/user";

let bodySchema = yup
  .object()
  .shape({
    address: yup.string().required(),
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

  res.status(200).send(user);
}

const handler = methods({
  patch: patchHandler,
});

export default authMiddleware(handler);
