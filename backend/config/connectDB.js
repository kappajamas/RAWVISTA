import pg from "pg";
import env from "dotenv";

env.config();

const envReqVar = [
  "PG_USER",
  "PG_HOST",
  "PG_DATABASE",
  "PG_PORT",
  "PG_PASSWORD",
];

envReqVar.forEach((varName) => {
  if (!process.env[varName]) {
    console.log(`Variabila ${varName} lipsește din BD!`);
    process.exit(1);
  }
});

export const dbConnection = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

export const dbConnect = async () => {
  try {
    const client = await dbConnection.connect();
    console.log("Conectat la BD!");
    client.release();
  } catch (err) {
    console.error("Nu s-a putut conecta la BD!", err.message);
    process.exit(1);
  }
};

dbConnection.on("error", (err) => {
  console.error("Eroare la BD: ", err);
  process.exit(1);
});
