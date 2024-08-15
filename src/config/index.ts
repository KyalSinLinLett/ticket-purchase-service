import dotenv from "dotenv";
import moment from "moment-timezone";

dotenv.config();
moment.tz.setDefault("UTC");

const {
  ENV,
  DB_HOST,
  DB_PORT,
  DB_USN,
  DB_PASSWORD,
  DB_NAME,
  DB_MAX_CONNECTION,
  VERSION,
  SERVICE_NAME,
  ENABLE_DB_LOGGING,
  TOKEN_ENC_KEY
} = process.env;

const configuration = {
  env: ENV,
  dbHost: DB_HOST || "127.0.0.1",
  dbPort: Number(DB_PORT as string) || 5433,
  dbUsn: DB_USN || "postgres",
  dbPassword: DB_PASSWORD || "postgres",
  dbName: DB_NAME || "postgres",
  dbMaxConnection: Number(DB_MAX_CONNECTION as string) || 2,
  serviceName: SERVICE_NAME || "ticket-purchase-service",
  version: VERSION || "0.0.1",
  enableSqlLogging: ENABLE_DB_LOGGING || false,
  encryptionKey: TOKEN_ENC_KEY || ""
};

export { configuration };
