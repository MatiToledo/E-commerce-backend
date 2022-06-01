import type { NextApiRequest, NextApiResponse } from "next";

export function getOffsetAndLimit(
  req: NextApiRequest,
  maxLimit = 100,
  maxOffset = 10000
) {
  const queryLimit = parseInt((req.query.limit as string) || "0");
  const queryOffset = parseInt((req.query.offset as string) || "0");
  const limit = queryLimit <= maxLimit ? queryLimit : maxLimit;
  const offset = queryOffset < maxOffset ? queryOffset : 0;
  return { limit, offset };
}
