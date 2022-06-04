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
  try {
    const find = await findOrCreateAuth(req.body);
    const auth = await sendCode(req.body.email);
    res.json({ error: false });
  } catch (error) {
    res.json({ error: "ERROR ENDPOINT", body: req.body });
  }
  // res.json({ email: auth.data.email, code: auth.data.code });
}

const handler = methods({
  post: postHandler,
});

// const corsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
//   await corsMiddleware(req, res, validateBody(bodySchema, handler));
// };
// export default corsHandler;

export default validateBody(bodySchema, handler);
