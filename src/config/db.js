import { PrismaClient } from "@prisma/client";

let db;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else if (process.env.NODE_ENV === "development") {
  db = new PrismaClient({
    log: ["query"],
  });
}

export { db };
