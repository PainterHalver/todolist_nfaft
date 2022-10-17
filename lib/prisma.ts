import { Prisma, PrismaClient } from "@prisma/client";
import crypto from "crypto";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create one instance of PrismaClient and re-use it across your application
// Assign PrismaClient to a global variable in dev environments only
// to prevent hot reloading from creating new instances
let prisma: PrismaClient;
let isNewInstance: boolean = false;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
  isNewInstance = true;
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
    isNewInstance = true;
  }
  prisma = global.prisma;
}

if (isNewInstance) {
  // Middleware
  // Post Create User hash password
  prisma.$use(async (params: Prisma.MiddlewareParams, next) => {
    if (params.model === "User" && params.action === "create") {
      console.log("MIDDLEWARE");
      const user = params.args.data;
      user.password = crypto.createHash("md5").update(user.password).digest("hex");
    }
    return next(params);
  });
}
export default prisma;
