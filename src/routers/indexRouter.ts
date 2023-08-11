import { Request, Response, Router, NextFunction } from "express";
import { HomeHandler } from "./handlers/index/home";
import { SignOutHandler, getReturnPageFromSession } from "./handlers/index/signout";
import {
  ACCESSIBILITY_STATEMENT_PAGE,
  ACCESSIBILITY_STATEMENT_URL,
  ACCOUNTS_SIGNOUT_PATH,
  HOME_PAGE,
  HOME_URL,
  REFERENCE,
  SIGN_OUT_PAGE,
  SIGN_OUT_URL,
  THERE_IS_A_PROBLEM_PAGE,
  THERE_IS_A_PROBLEM_URL,
  COMPANY_NUMBER_URL
} from "../config";

const indexRouter: Router = Router();
const routeViews: string = "router_views/index/";

indexRouter.get(HOME_URL, async (req: Request, res: Response, next: NextFunction) => {
  const handler = new HomeHandler();
  const viewData = await handler.get(req, res);
  res.render(`${routeViews}` + HOME_PAGE, viewData);
});

indexRouter.post(HOME_URL, (req: Request, res: Response, next: NextFunction) => {
  res.redirect(COMPANY_NUMBER_URL);
});

indexRouter.get(SIGN_OUT_URL, async (req: Request, res: Response, next: NextFunction) => {
  const handler = new SignOutHandler();
  await handler.get(req, res).then((viewData) => {
    res.render(`${routeViews}` + SIGN_OUT_PAGE, viewData);
  }).catch(() => {
    res.redirect(THERE_IS_A_PROBLEM_URL);
  });
});

indexRouter.post(SIGN_OUT_URL, async (req: Request, res: Response, next: NextFunction) => {
  const handler = new SignOutHandler();
  switch (req.body.signout) {
      case "yes": {
        return res.redirect(ACCOUNTS_SIGNOUT_PATH);
      }
      case "no": {
        return res.redirect(getReturnPageFromSession(req));
      }
      default: {
        const viewData = await handler.default(req, res);
        res.render(`${routeViews}` + SIGN_OUT_PAGE, viewData);
      }
  }
});

indexRouter.get(ACCESSIBILITY_STATEMENT_URL, async (req: Request, res: Response, next: NextFunction) => {
  res.render(`${routeViews}` + ACCESSIBILITY_STATEMENT_PAGE);
});

indexRouter.get(THERE_IS_A_PROBLEM_URL, async (req: Request, res: Response, next: NextFunction) => {
  res.render(`${routeViews}` + THERE_IS_A_PROBLEM_PAGE, { title: "Service offline - " + REFERENCE + " - GOV.UK" });
});

export default indexRouter;
