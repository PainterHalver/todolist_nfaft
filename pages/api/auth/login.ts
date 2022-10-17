import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/prisma";
import crypto from "crypto";

type LoginErrorType = {
  username?: String;
  password?: String;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username, password } = req.body;

    const errors: LoginErrorType = {};

    // Validate the data
    if (!password || !password.trim()) errors["password"] = "Password must not be empty";
    if (!username || !username.trim()) errors["username"] = "Username must not be empty";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Bad Request", errors });
    }

    const user = await prisma.user.findFirst({
      where: {
        username,
        password: crypto.createHash("md5").update(password).digest("hex"),
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        errors: { username: "Invalid credentials" },
      });
    }

    // Return user
    // TODO: Better way to hide password
    return res.status(200).json({ message: "success", user: { ...user, password: undefined } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
