import type { NextApiRequest, NextApiResponse } from "next";

import { Prisma } from "@prisma/client";
import prisma from "../../../prisma/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ posts: ["John Doe"] });
}
