import type { NextApiRequest, NextApiResponse } from "next";

export function getOffsetAndLimit(
  req: NextApiRequest,
  maxLimit = 100,
  maxOffset = 10000
) {
  const queryLimit: number = parseInt((req.query.limit as string) || "0");
  const queryOffset: number = parseInt((req.query.offset as string) || "0");

  const limit = queryLimit //Hay query limit ?
    ? queryLimit <= maxLimit //queryLimit es menor que maxLimit ?
      ? queryLimit // Si es menor limit = queryLimit
      : maxLimit // Si es mayor limit = maxLimit
    : 10; // Si no hay queryLimit , limit = 10

  const offset = queryOffset < maxOffset ? queryOffset : 0;

  return {
    limit,
    offset,
  };
}
