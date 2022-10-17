import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// Middleware

// Post Create User hash password
prisma.$use(async (params, next) => {
  if (params.model === "User" && params.action.match(/create|update|upsert/)) {
    console.log(params);
    params.args.data.password = crypto.createHash("md5").update(params.args.data.password).digest("hex");
  }
  return next(params);
});

export default prisma;
