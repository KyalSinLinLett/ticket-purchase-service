import { App } from "app";
import { TEST_ROUTE } from "data/route";
import { RequestHandler } from "express";
import { Details } from "express-useragent";
import moment from "moment";
import { HttpStatusCode } from "types/http";
import { JsonResponse } from "types/index";
import { configuration } from "config";

interface ITestCtrl {
  testHandler: RequestHandler
}

export class TestCtrl implements ITestCtrl {
  app: App;
  constructor(app: App) {
    this.app = app;
    this.initRoute();
  }

  testHandler: RequestHandler = (req, res, next): void => {}

  initRoute = (): void => {
    this.app.route(TEST_ROUTE, this.testHandler);
  };
}
