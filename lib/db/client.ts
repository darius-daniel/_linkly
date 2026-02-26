import { PrismaClient } from "@/app/generated/prisma/client";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  transactionOptions: { maxWait: 5000, timeout: 60000 },
});
export default prisma;
