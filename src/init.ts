import { App } from "./app";
import { configuration } from "config";
import { TestCtrl } from "controllers/test-ctrl";
import { initModels } from "db/init";

const {
  dbHost,
  dbPort,
  dbUsn,
  dbPassword,
  dbName,
  dbMaxConnection,
  serviceName,
  version,
} = configuration;

const app = new App(
  "/ticket-api",
  version,
  serviceName,
  dbHost,
  dbPort,
  dbName,
  dbUsn,
  dbPassword,
  dbMaxConnection,
  initModels,
  false,
  false
);

new TestCtrl(app);

export { app };
