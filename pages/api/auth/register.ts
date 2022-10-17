import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../lib/prisma";

type RegisterErrorType = {
  email?: String;
  username?: String;
  password?: String;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password, username, confirmPassword } = req.body;

    const errors: RegisterErrorType = {};
    // Validate the data
    if (!password || !password.trim()) errors["password"] = "Password must not be empty";
    if (password !== confirmPassword) errors["password"] = "Passwords do not match";

    // Email validation
    if (!email || !email.trim()) errors["email"] = "Email must not be empty";
    else {
      const emailUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (emailUser) errors["email"] = "Email already exists";
    }

    // Username validation
    if (!username || !username.trim()) errors["username"] = "Username must not be empty";
    else {
      const usernameUser = await prisma.user.findUnique({
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

    // Return user
    return res.status(201).json({ message: "success", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
