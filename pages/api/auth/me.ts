import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

import prisma from "../../../lib/prisma";
import { cors } from "../../../lib/cors";

export default cors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid authorization token" });
    }

    const token = authorization.split("Bearer ")[1];
    const userFromToken = jwt.verify(token, process.env.JWT_SECRET || "") as Prisma.UserCreateInput;

    if (!userFromToken) {
      return res.status(401).json({ message: "Invalid authorization token" });
    }

    const user = await prisma.user.findFirst({
      where: {
        username: userFromToken.username,
      },
    });

    // TODO: Better way to hide password
    return res.status(200).json({ message: "success", user: { ...user, password: undefined } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
