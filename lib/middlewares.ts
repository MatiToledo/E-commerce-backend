import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import { decode } from "lib/jwt";
import parseToken from "parse-bearer-token";
import Cors from "cors";

const cors = Cors({
  methods: ["GET", "POST", "PATCH"],
});

export function corsMiddleware(req, res, cb) {
  return new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      console.log(result instanceof Error);
      if (result instanceof Error) return reject(result);
      cb(req, res);

      return resolve(result);
    });
  });
}

// export const cors = initMiddleware(
//   Cors({ methods: ["GET", "POST", "PATCH", "OPTIONS"] })
// );
// export default function initMiddleware(middleware) {
//   return (req, res) =>
//     new Promise((resolve, reject) => {
//       middleware(req, res, (result) => {
//         console.log(result instanceof Error);

//         if (result instanceof Error) {
//           return reject(result);
//         }
//         return resolve(result);
//       });
//     });
// }

export function authMiddleware(callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    // await cors(req, res);
    const token = parseToken(req);
    if (!token) {
      res.status(401).send({ message: "No hay token" });
    }
    const decodedToken = decode(token);
    if (decodedToken) {
      callback(req, res, decodedToken);
    } else {
      res.status(401).send({ message: "token incorrecto" });
    }
  };
}

export function validateBody(bodySchema, callback) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    // await cors(req, res);
    if (req.body !== "") {
      try {
        await bodySchema.validate(req.body);
        callback(req, res);
      } catch (e) {
        res.status(422).send({ field: "body", message: e });
      }
    } else {
      callback(req, res);
    }
  };
}

export function validateQuery(bodySchema, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    // await cors(req, res);
    try {
      await bodySchema.validate(req.query);
      callback(req, res);
    } catch (e) {
      res.status(422).send({ field: "body", message: e });
    }
  };
}

export function validateQueryAndBody(bodySchema, querySchema, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    // await cors(req, res);
    try {
      await bodySchema.validate(req.body);
      await querySchema.validate(req.query);
      callback(req, res);
    } catch (e) {
      res.status(422).send({ field: "body or query", message: e });
    }
  };
}
