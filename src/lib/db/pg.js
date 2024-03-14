import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.POSTGRES_MICRO_AI_URL,
});

export default pool;
