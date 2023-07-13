import { getCompanyProfile } from "../../../../src/services/company/company.profile.service";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { createApiClient, Resource } from "@companieshouse/api-sdk-node";
import { createAndLogError, createAndLogServiceUnavailable } from "../../../../src/lib/Logger";
import { validSDKResource } from "../../../mocks/company.profile.mock";
import { StatusCodes } from "http-status-codes";
jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/lib/Logger");

const mockCreateApiClient = createApiClient as jest.Mock;
const mockGetCompanyProfile = jest.fn();
const mockCreateAndLogError = createAndLogError as jest.Mock;
const mockCreateAndLogServiceUnavailable = createAndLogServiceUnavailable as jest.Mock;

mockCreateApiClient.mockReturnValue({
  companyProfile: {
    getCompanyProfile: mockGetCompanyProfile
  }
});

mockCreateAndLogError.mockReturnValue(new Error());
mockCreateAndLogServiceUnavailable.mockReturnValue(new Error());

const clone = (objectToClone: any): any => {
  return JSON.parse(JSON.stringify(objectToClone));
};

describe("Company profile service test", () => {
  const COMPANY_NUMBER = "1234567";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCompanyProfile tests", () => {
    it("Should return a company profile", async () => {
      mockGetCompanyProfile.mockResolvedValueOnce(clone(validSDKResource));
      const returnedProfile: CompanyProfile = await getCompanyProfile(COMPANY_NUMBER);

      Object.getOwnPropertyNames(validSDKResource.resource).forEach(property => {
        expect(returnedProfile).toHaveProperty(property);
      });
    });

    it("Should throw an error if no response returned from SDK", async () => {
      mockGetCompanyProfile.mockResolvedValueOnce(undefined);

      await getCompanyProfile(COMPANY_NUMBER)
        .then(() => {
          fail("Was expecting an error to be thrown.");
        })
        .catch(() => {
          expect(createAndLogServiceUnavailable).toHaveBeenCalledWith(expect.stringContaining("Company profile API"));
          expect(createAndLogServiceUnavailable).toHaveBeenCalledWith(expect.stringContaining(`${COMPANY_NUMBER}`));
        });
    });

    it("Should throw an error if SERVICE UNAVAILABLE returned from SDK", async () => {
      const HTTP_STATUS_CODE = StatusCodes.SERVICE_UNAVAILABLE;
      mockGetCompanyProfile.mockResolvedValueOnce({
        httpStatusCode: HTTP_STATUS_CODE
      } as Resource<CompanyProfile>);

      await getCompanyProfile(COMPANY_NUMBER)
        .then(() => {
          fail("Was expecting an error to be thrown.");
        })
        .catch(() => {
          expect(createAndLogServiceUnavailable).toHaveBeenCalledWith(expect.stringContaining("Company profile API"));
          expect(createAndLogServiceUnavailable).toHaveBeenCalledWith(expect.stringContaining(`${COMPANY_NUMBER}`));
        });
    });

    it(`Should throw an error if status code >= ${StatusCodes.BAD_REQUEST}`, async () => {
      const HTTP_STATUS_CODE = StatusCodes.BAD_REQUEST;
      mockGetCompanyProfile.mockResolvedValueOnce({
        httpStatusCode: HTTP_STATUS_CODE
      } as Resource<CompanyProfile>);

      await getCompanyProfile(COMPANY_NUMBER)
        .then(() => {
          fail("Was expecting an error to be thrown.");
        })
        .catch(() => {
          expect(createAndLogError).toHaveBeenCalledWith(expect.stringContaining(`${HTTP_STATUS_CODE}`));
          expect(createAndLogError).toHaveBeenCalledWith(expect.stringContaining(`${COMPANY_NUMBER}`));
        });
    });

    it("Should throw an error if no response resource returned from SDK", async () => {
      mockGetCompanyProfile.mockResolvedValueOnce({} as Resource<CompanyProfile>);

      await getCompanyProfile(COMPANY_NUMBER)
        .then(() => {
          fail("Was expecting an error to be thrown.");
        })
        .catch(() => {
          expect(createAndLogError).toHaveBeenCalledWith(expect.stringContaining("no resource"));
          expect(createAndLogError).toHaveBeenCalledWith(expect.stringContaining(`${COMPANY_NUMBER}`));
        });
    });
  });
});
