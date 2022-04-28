import type { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import { decode } from "lib/jwt";
import parseToken from "parse-bearer-token";

export function authMiddleware(callback) {
  return function (req: NextApiRequest, res: NextApiResponse) {
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
  return async function (req: NextApiRequest, res: NextApiResponse) {
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
    try {
      await bodySchema.validate(req.body);
      await querySchema.validate(req.query);
      callback(req, res);
    } catch (e) {
      res.status(422).send({ field: "body or query", message: e });
    }
  };
}
