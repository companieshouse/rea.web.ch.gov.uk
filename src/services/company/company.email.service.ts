import {companyEmail, companyEmailResource} from "./resources/resources";
import {createApiClient, Resource} from "@companieshouse/api-sdk-node";
import {CHS_API_KEY, EMAIL_CHANGE_EMAIL_ADDRESS_URL, ORACLE_QUERY_API_URL} from "../../config/index";
import {StatusCodes} from 'http-status-codes';
import {Request} from "express";
import {Session} from "@companieshouse/node-session-handler";
import {COMPANY_NUMBER, SUBMISSION_ID, TRANSACTION_CLOSE_ERROR, UPDATED_COMPANY_EMAIL} from "../../constants/app.const";
import {logger} from "../../lib/Logger";
import {closeTransaction, createRegisteredEmailAddressResource} from "../transaction/transaction.service";


/**
 * Get the registered email address for a company.
 *
 * @param companyNumber the company number to look up
 */
export const getCompanyEmail = async (companyNumber: string): Promise<Resource<companyEmail>> => {
    // build client object
    const client = createApiClient(
        CHS_API_KEY,
        undefined,
        ORACLE_QUERY_API_URL
    );
    const resp = await client.apiClient.httpGet(`/company/${companyNumber}/registered-email-address`);

    const emailResource: Resource<companyEmail> = {
        httpStatusCode: resp.status
    };

    // return error response code if one received
    if (resp.status >= StatusCodes.BAD_REQUEST) {
        return emailResource;
    }

    // cast response body to expected companyEmailResource type
    const body = resp.body as companyEmailResource;

    emailResource.resource = {
        companyEmail: body.registered_email_address
    };
    return emailResource;
};

export const processGetCheckRequest = async (req: Request): Promise<object> => {
    logger.info(`Return new email address stored in session`);

    const session: Session = req.session as Session;
    const updatedCompanyEmail: string | undefined = session.getExtraData(UPDATED_COMPANY_EMAIL);

    return {
        "updatedCompanyEmail": updatedCompanyEmail,
        backUri: EMAIL_CHANGE_EMAIL_ADDRESS_URL,
        signoutBanner: true,
        userEmail: req.session?.data.signin_info?.user_profile?.email
    };
};

export const processPostCheckRequest = async (req: Request) => {
    logger.info(`Return if new email address was confirmed`);

    const session: Session = req.session as Session;
    const updatedCompanyEmail = req.session?.getExtraData(UPDATED_COMPANY_EMAIL);
    const emailConfirmation: string | undefined = req.body.emailConfirmation;
    if (emailConfirmation === undefined) {

        return {
            statementError: "You need to accept the registered email address statement",
            updatedCompanyEmail: updatedCompanyEmail,
            backUri: EMAIL_CHANGE_EMAIL_ADDRESS_URL,
            signoutBanner: true,
            userEmail: req.session?.data.signin_info?.user_profile?.email
        };
    }

    const transactionId = session.getExtraData(SUBMISSION_ID);

    const response = await createRegisteredEmailAddressResource(session, <string>transactionId, <string>updatedCompanyEmail)
        .then((resp) => {
            return resp;
        })
        .catch((err) => {
            return err;
        });

    const companyNumber = session.getExtraData(COMPANY_NUMBER);

    try {
        await closeTransaction(session, <string>companyNumber, <string>transactionId).then((transactionId) => {
            return {status: "success"};
        });
    } catch (e) {
        return {
            statementError: TRANSACTION_CLOSE_ERROR + companyNumber
        };
    }
};
