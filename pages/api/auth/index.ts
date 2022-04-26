// Recibe un email y encuentra/crea un user con ese email y le envía un
// código vía email.

import * as yup from "yup";
import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { findOrCreateAuth } from "controllers/auth";
import { sendCode } from "controllers/auth";

let bodySchema = yup
  .object()
  .shape({
    email: yup.string().required(),
    address: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await bodySchema.validate(req.body);
  } catch (error) {
    res.status(406).send({ field: "body", message: error });
  }

  const find = await findOrCreateAuth(req.body);
  const auth = await sendCode(req.body.email);
  res.send(auth);
}

export default methods({
  post: postHandler,
});
