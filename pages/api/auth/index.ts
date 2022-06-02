// Recibe un email y encuentra/crea un user con ese email y le envía un
// código vía email.

import * as yup from "yup";
import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { findOrCreateAuth } from "controllers/auth";
import { sendCode } from "controllers/auth";
import { validateBody } from "lib/middlewares";

let bodySchema = yup
  .object()
  .shape({
    email: yup.string().required(),
    address: yup.string(),
  })
  .noUnknown(true)
  .strict();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  console.log("POSTHANDLER");

  const find = await findOrCreateAuth(req.body);
  const auth = await sendCode(req.body.email);
  res.status(200).send({ email: auth.data.email, code: auth.data.code });
}

const handler = methods({
  post: postHandler,
});

// const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
//   await corsMiddleware(req, res, validateBody(bodySchema, handler));
// };
// export default corsHandler;

export default validateBody(bodySchema, handler);
