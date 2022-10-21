import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "../../../lib/prisma";
import { getAuth } from "firebase-admin/auth";
import app from "../../../lib/firebase_admin";

type RegisterErrorType = {
  email?: String;
  username?: String;
  password?: String;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password, username, confirmPassword } = req.body;

    const errors: RegisterErrorType = {};
    // Validate the data
    if (!password || !password.trim()) errors["password"] = "Password must not be empty";
    if (password !== confirmPassword) errors["password"] = "Passwords do not match";

    // Email validation
    if (!email || !email.trim()) errors["email"] = "Email must not be empty";
    else {
      const emailUser = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (emailUser) errors["email"] = "Email already exists";
    }

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
        email,
        password,
        username,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { username: newUser.username, email: newUser.email, id: newUser.id },
      process.env.JWT_SECRET!
    );
    const firebaseToken = await getAuth(app).createCustomToken(newUser.id, {
      username: newUser.username,
      email: newUser.email,
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
