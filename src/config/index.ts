import {getEnvironmentValue} from "../utils/environment/environment_value";

// URL params
export enum urlParams {
  PARAM_COMPANY_NUMBER = "companyNumber",
  PARAM_TRANSACTION_ID = "transactionId",
  PARAM_SUBMISSION_ID = "submissionId",
  PARAM_APPOINTMENT_ID = "appointmentId"
}

// Transaction statuses
export const transactionStatuses = {
  CLOSED: "closed"
};

// APP CONFIGs
export const APPLICATION_NAME = "registered-email-address-web";
export const NODE_ENV = process.env.NODE_ENV;
export const PORT = getEnvironmentValue("PORT", "3000");
export const CHS_URL = getEnvironmentValue("CHS_URL", "http://chs.local");
export const CDN_HOST = getEnvironmentValue("CDN_HOST", "cdn.chs.local");
export const CDN_URL_CSS = getEnvironmentValue("CDN_URL_CSS", "/css");
export const CDN_URL_JS = getEnvironmentValue("CDN_URL_JS", "/js");
export const CACHE_SERVER = getEnvironmentValue("CACHE_SERVER", "localhost:6379");
export const COOKIE_SECRET = getEnvironmentValue("COOKIE_SECRET", "ChGovUk-XQrbf3sLj2abFxIY2TlapsJ");
export const COOKIE_DOMAIN = getEnvironmentValue("COOKIE_DOMAIN", "chs.local");
export const CHS_API_KEY = getEnvironmentValue("CHS_API_KEY", "chs.api.key");
export const CHS_INTERNAL_API_KEY = getEnvironmentValue("CHS_INTERNAL_API_KEY", "chs.internal.api.key");
export const COOKIE_NAME = getEnvironmentValue("COOKIE_NAME", "__SID");
export const DEFAULT_SESSION_EXPIRATION = getEnvironmentValue("DEFAULT_SESSION_EXPIRATION", "3600");
export const PIWIK_URL = getEnvironmentValue("PIWIK_URL", "https://matomo.platform.aws.chdev.org");
export const PIWIK_SITE_ID = getEnvironmentValue("PIWIK_SITE_ID", "24");
export const PIWIK_START_GOAL_ID = getEnvironmentValue("PIWIK_START_GOAL_ID", "3");
export const LOG_LEVEL = getEnvironmentValue("LOG_LEVEL", "DEBUG");
export const API_URL = getEnvironmentValue("API_URL", "http://api.chs.local:4001");
export const ACCOUNT_URL = getEnvironmentValue("ACCOUNT_URL", "http://account.chs.local");
export const SESSION_TIMEOUT = getEnvironmentValue("SESSION_TIMEOUT");
export const SESSION_COUNTDOWN = getEnvironmentValue("SESSION_COUNTDOWN");
export const ORACLE_QUERY_API_URL = getEnvironmentValue("ORACLE_QUERY_API_URL", "http://api.chs.local:4001");
export const WEBFILING_LOGIN_URL = getEnvironmentValue("WEBFILING_LOGIN_URL", "https://ewf.companieshouse.gov.uk/");

export const FEEDBACK_LINK = "https://www.smartsurvey.co.uk/s/update-reg-email-addr-fdbck/";
export const CONFIRMATION_FEEDBACK_LINK = 'https://www.smartsurvey.co.uk/s/update-reg-email-addr-conf/';
export const DESCRIPTION = "Update Registered Email Address Transaction";
export const REFERENCE = "UpdateRegisteredEmailAddressReference_";
export const STATIC_SUBMISSION_ID = "72hw92jw992km90mw9002m22";

// TEMPLATES
export const HOME_PAGE = "home";
export const REA_HOME_PAGE = "/registered-email-address";
export const COMPANY_LOOKUP_PAGE = "/company-lookup";
export const COMPANY_NUMBER_PAGE = "company/number";
export const COMPANY_CONFIRM_PAGE = "company/confirm";
export const EMAIL_CHANGE_EMAIL_ADDRESS = "email/change-email-address";
export const EMAIL_CHECK_ANSWER = "email/check-your-answer";
export const EMAIL_UPDATE_SUBMITTED = "email/update-submitted";
export const COMPANY_INVALID_PAGE = "invalid";
export const SIGN_OUT_PAGE = `signout`;
export const ACCESSIBILITY_STATEMENT_PAGE = "accessibility-statement";
export const THERE_IS_A_PROBLEM_PAGE = "there-is-a-problem";


// ROUTING PATHS
export const HEALTHCHECK_URL = "/healthcheck";
export const HOME_URL = `${REA_HOME_PAGE}`;
export const COMPANY_BASE_URL = `${REA_HOME_PAGE}/company`;
export const EMAIL_BASE_URL = `${REA_HOME_PAGE}/email`;
export const NUMBER_URL = "/number";
export const CONFIRM_URL = "/confirm";
export const INVALID_URL = "/invalid";
export const CHANGE_EMAIL_ADDRESS_URL = "/change-email-address";
export const CHECK_ANSWER_URL = "/check-your-answer";
export const UPDATE_SUBMITTED = "/update-submitted";

// FULL URLS
export const SIGN_OUT_URL = `${HOME_URL}/${SIGN_OUT_PAGE}`;
export const ACCOUNTS_SIGNOUT_PATH = `${ACCOUNT_URL}/signout`;
export const COMPANY_NUMBER_URL = `${HOME_URL}/${COMPANY_NUMBER_PAGE}`;
export const COMPANY_CONFIRM_URL = `${HOME_URL}/${COMPANY_CONFIRM_PAGE}`;
export const INVALID_COMPANY_URL = `${COMPANY_BASE_URL}/${COMPANY_INVALID_PAGE}`;
export const EMAIL_CHANGE_EMAIL_ADDRESS_URL = `${HOME_URL}/${EMAIL_CHANGE_EMAIL_ADDRESS}`;
export const EMAIL_CHECK_ANSWER_URL = `${HOME_URL}/${EMAIL_CHECK_ANSWER}`;
export const ACCESSIBILITY_STATEMENT_URL = `${HOME_URL}/${ACCESSIBILITY_STATEMENT_PAGE}`;
export const EMAIL_UPDATE_SUBMITTED_URL = `${HOME_URL}/${EMAIL_UPDATE_SUBMITTED}`;
export const THERE_IS_A_PROBLEM_URL = `${HOME_URL}/${THERE_IS_A_PROBLEM_PAGE}`;
export const COMPANY_LOOKUP_URL = `${COMPANY_LOOKUP_PAGE}/search?forward=${COMPANY_CONFIRM_URL}?companyNumber={companyNumber}`;
