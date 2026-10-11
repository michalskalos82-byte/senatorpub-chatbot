const { Pool } = require("pg");

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("railway.internal")
    ? false
    : { rejectUnauthorized: false },
});

async function cleanup() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("Chýba DATABASE_URL.");
    }

    const result = await db.query(`
      DELETE FROM chat_logs
      WHERE created_at < NOW() - INTERVAL '90 days'
    `);

    console.log(
      `Čistenie dokončené. Vymazaných záznamov: ${result.rowCount}`
    );
  } catch (error) {
    console.error("Chyba pri čistení databázy:", error.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
}

cleanup();
