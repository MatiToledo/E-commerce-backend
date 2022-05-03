//Permite modificar un dato puntual del usuario al que pertenezca el token
//usado en el request. En este caso el objeto que describe la dirección.

import * as yup from "yup";
import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, validateBody } from "lib/middlewares";
import { modifyData } from "controllers/users";

let bodySchema = yup
  .object()
  .shape({
    address: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const user = await modifyData(req.body, token.userId);

  res.status(200).send(user);
}

const handler = methods({
  patch: patchHandler,
});

const auth = authMiddleware(handler);

export default validateBody(bodySchema, auth);
