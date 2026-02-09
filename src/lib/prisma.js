import { PrismaClient } from '@prisma/client';

// Singleton pattern: create a single instance of PrismaClient
// This prevents creating multiple database connections
const prisma = new PrismaClient();

export default prisma;
