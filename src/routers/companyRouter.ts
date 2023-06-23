import { Request, Response, Router, NextFunction } from "express";
import { CompanySearchHandlerPost } from "./handlers/company/companySearch";
import { ConfirmCompanyHandler } from "./handlers/company/confirm";
import { ChangeEmailAddressHandler } from "./handlers/company/changeEmailAddress";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import CompanyDetails from "../mapper/company/companyDetails.mapper";

import * as config from "../config/index";
import logger from "../lib/Logger";

import FormValidator from "../utils/formValidator.util";
import CompanyNumberSanitizer from "../utils/companyNumberSanitizer";
import * as constants from "../constants/app.const";

const router: Router = Router();

const routeViews: string = "router_views/company/";
const errorsConst: string = "errors";

router.get(config.NUMBER_URL, async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`GET request to enter company number`);
    res.render(`${routeViews}` + config.COMPANY_SEARCH_PAGE);
    // alternatively use this to call the Company lookup service:
    // return res.redirect(config.COMPANY_LOOKUP);
});

router.post(config.NUMBER_URL, async (req: Request, res: Response, next: NextFunction) => {
    var formValidator = new FormValidator();
    var companyNumberSanitizer = new CompanyNumberSanitizer();
    var data = await new CompanySearchHandlerPost(formValidator, companyNumberSanitizer).post(req, res).then((data) => {
        // eslint-disable-next-line no-prototype-builtins
        if (data.hasOwnProperty(errorsConst) === true) {
            res.render(`${routeViews}` + config.COMPANY_SEARCH_PAGE, data);
        } else {
            // eslint-disable-next-line no-unused-expressions
            req.session?.setExtraData(constants.COMPANY_PROFILE, data);
            res.redirect(config.COMPANY_CONFIRM_URL);
        }
    });
});

router.get(config.CONFIRM_URL, async (req: Request, res: Response, next: NextFunction) => {
    const handler = new ConfirmCompanyHandler();
    const viewData = await handler.get(req, res);
    // eslint-disable-next-line no-prototype-builtins
    if (viewData.hasOwnProperty(errorsConst) === true) {
        res.render(`${routeViews}` + config.COMPANY_SEARCH_PAGE, viewData);
    } else {
        res.render(`${routeViews}` + config.CONFIRM_URL, viewData);
    }
});

router.post(config.CONFIRM_URL, async (req: Request, res: Response, next: NextFunction) => {
    const handler = new ConfirmCompanyHandler();
    const viewData = await handler.post(req, res);
    const companyProfile: CompanyProfile | undefined = req.session?.getExtraData("companyProfile");
    if (companyProfile !== undefined) {
        req.session?.setExtraData("companyNumber", companyProfile.companyNumber);
    }
    res.redirect(config.COMPANY_CHANGE_EMAIL_ADDRESS_URL);
});

// GET: /change-email-address
router.get(config.CHANGE_EMAIL_ADDRESS_URL, async (req: Request, res: Response, next: NextFunction) => {
    const handler = new ChangeEmailAddressHandler();
    await handler.get(req, res).then((viewData) => {
        res.render(`${routeViews}` + config.CHANGE_EMAIL_ADDRESS_URL, viewData);
    });
});

// POST: /change-email-address
router.post(config.CHANGE_EMAIL_ADDRESS_URL, async (req: Request, res: Response, next: NextFunction) => {
    const handler = new ChangeEmailAddressHandler();
    const viewData = await handler.post(req, res);
    res.render(`${routeViews}` + config.CHANGE_EMAIL_ADDRESS_URL, viewData);
});

export default router;
