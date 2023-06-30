import * as fs from "fs";
import * as yaml from "js-yaml";

interface ApiEnumerationsConstants {
  [propName: string]: any
}

const apiConstantsFile = fs.readFileSync("api-enumerations/constants.yml", "utf8");
const apiConstants: ApiEnumerationsConstants = yaml.load(apiConstantsFile) as ApiEnumerationsConstants;

const registeredEmailAddressFile = fs.readFileSync("api-enumerations/officer_filing.yml", "utf8");
const officerFilingMessages: ApiEnumerationsConstants = yaml.load(registeredEmailAddressFile) as ApiEnumerationsConstants;

export const lookupCompanyType = (companyTypeKey: string): string => {
  return apiConstants.company_type[companyTypeKey] || companyTypeKey;
};

export const lookupCompanyStatus = (companyStatusKey: string): string => {
  return apiConstants.company_status[companyStatusKey] || companyStatusKey;
};

export const lookupAPIValidationMessage = (validationMessageKey: string): string => {
  return officerFilingMessages.validation[validationMessageKey] || validationMessageKey;
};

export const lookupWebValidationMessage = (validationMessageKey: string): string => {
  return officerFilingMessages.validation_web[validationMessageKey] || validationMessageKey;
};

export const overwriteDirectorName = (validationMessage: string, directorName: string): string => {
  return validationMessage.replace("<director-name>", directorName);
};

export const convertAPIMessageToKey = (validationMessage: string): string => {

  for (const element of Object.keys(officerFilingMessages.validation)) {
    let message = lookupAPIValidationMessage(element);

    message = message.replace(/<.*>/g, "(.*)");

    const matchMessages = new RegExp(message);

    if (matchMessages.test(validationMessage)) {
      return element;
    }
  }

  return validationMessage;
};
