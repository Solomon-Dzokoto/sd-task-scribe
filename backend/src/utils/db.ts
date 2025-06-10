import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function testConnection() {
  try {
    await prisma.$connect();
    // Test the connection with a simple query
    await prisma.user.findFirst();
    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return false;
  }
}

export { prisma };
