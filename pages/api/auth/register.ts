import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "firebase-admin/auth";
import jwt from "jsonwebtoken";

import prisma from "../../../lib/prisma";
import app from "../../../lib/firebase_admin";

type RegisterErrorType = {
  username?: String;
  password?: String;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { username, password, confirmPassword } = req.body;

    const errors: RegisterErrorType = {};
    // Validate the data
    if (!password || !password.trim()) errors["password"] = "Password must not be empty";
    if (password !== confirmPassword) errors["password"] = "Passwords do not match";

    // Username validation
    if (!username || !username.trim()) errors["username"] = "Username must not be empty";
    else {
      const usernameUser = await prisma.user.findFirst({
        where: {
          username,
        },
      });
      if (usernameUser) errors["username"] = "Username already exists";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Bad Request", errors });
    }

    // Create user
    const newUser = await prisma.user.create({
      data: {
        password,
        username,
      },
    });

    // Generate JWT
    const token = jwt.sign({ username: newUser.username, id: newUser.id }, process.env.JWT_SECRET!);
    const firebaseToken = await getAuth(app).createCustomToken(newUser.id, {
      username: newUser.username,
      id: newUser.id,
      note: "This is an additional claim!",
    });

    // Return user
    return res.status(201).json({ message: "success", user: newUser, token, firebaseToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
