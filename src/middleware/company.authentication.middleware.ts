import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { CHS_URL } from "../config/index";
import { Session } from "@companieshouse/node-session-handler";

export const companyAuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const session: Session = req.session as Session;
  const companyNumber: string = session.data.extra_data.companyNumber;

  const authMiddlewareConfig: AuthOptions = {
    chsWebUrl: CHS_URL,
    returnUrl: req.originalUrl,
    companyNumber: companyNumber
  };

  return authMiddleware(authMiddlewareConfig)(req, res, next);
};
