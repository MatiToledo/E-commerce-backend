// Devuelve info del user asociado a ese token

import { validateBody } from "lib/middlewares";
import * as yup from "yup";
import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { getUserData, modifyData } from "controllers/users";
import { modifyAuthEmail } from "controllers/auth";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const user = await getUserData(token.userId);
  res.status(200).send(user);
}

let bodySchema = yup
  .object()
  .shape({
    name: yup.string(),
    address: yup.string(),
    phone: yup.string(),
  })
  .noUnknown(true)
  .strict();

async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const user = await modifyData(req.body, token.userId);
  if (req.body.email) {
    const auth = modifyAuthEmail(req.body.email, token.userId);
  }

  res.status(200).send(user);
}

const handler = methods({
  get: getHandler,
  patch: patchHandler,
});

const auth = authMiddleware(handler);

// const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
//   await corsMiddleware(req, res, validateBody(bodySchema, auth));
// };

export default validateBody(bodySchema, auth);
