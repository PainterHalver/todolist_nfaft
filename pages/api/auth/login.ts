import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { getAuth } from "firebase-admin/auth";
import app from "../../../lib/firebase_admin";

type LoginErrorType = {
  username?: String;
  password?: String;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

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
        errors: { general: "Invalid username or password" },
      });
    }

    // Generate JWT
    const token = jwt.sign({ username: user.username, email: user.email, id: user.id }, process.env.JWT_SECRET!);
    const firebaseToken = await getAuth(app).createCustomToken(user.id, {
      username: user.username,
      email: user.email,
      id: user.id,
      note: "This is an additional claim!",
    });

    // Return user
    // TODO: Better way to hide password
    return res.status(200).json({ message: "success", user: { ...user, password: undefined }, token, firebaseToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
