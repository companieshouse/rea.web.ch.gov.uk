// jest.mock("../../../../src/services/transaction/transaction.service");
jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/api/api.service");
jest.mock("../../../../src/lib/Logger");

import "reflect-metadata";
import { Request, Response } from "express";
import { createRequest, createResponse, MockRequest, MockResponse } from 'node-mocks-http';
import { ChangeEmailAddressHandler } from "../../../../src/routers/handlers/email/changeEmailAddress";
import FormValidator from "../../../../src/utils/formValidator.util";
import { Session } from "@companieshouse/node-session-handler";
import { NO_EMAIL_ADDRESS_FOUND, NO_EMAIL_ADDRESS_SUPPLIED, EMAIL_ADDRESS_INVALID, REGISTERED_EMAIL_ADDRESS } from "../../../../src/constants/app.const";

const COMPANY_NO: string = "1234567";
const TEST_EMAIL_EXISTING: string = "test@test.co.biz";
const TEST_EMAIL_UPDATE: string = "new_test@test.co.biz";
const PAGE_TITLE: string = "Update a registered email address";
const BACK_LINK_PATH: string = "/registered-email-address/company/confirm";
const INVALID_EMAIL_ADDRESS: string = "test-test.co.biz";

// create form validator instance
const formValidator = new FormValidator();
// default handler instance
let changeEmailAddressHandler: ChangeEmailAddressHandler;

// request/response/session
let session: Session;
let request: MockRequest<Request>;
let response: MockResponse<Response>;

describe("Registered email address update - test GET method", () => {
  // clear down mocks
  beforeEach(() => {
    jest.clearAllMocks();
    changeEmailAddressHandler = new ChangeEmailAddressHandler(
      formValidator,
      TEST_EMAIL_EXISTING
    );
    // session instance
    session = new Session();
    // mock request/responses
    request = createRequest({
      session: session
    });
    response = createResponse();
  });
  
  it("Registered email address update - company email in session", async () => {
    //set email in session
    request.session?.setExtraData(REGISTERED_EMAIL_ADDRESS, TEST_EMAIL_EXISTING);

    await changeEmailAddressHandler.get(request, response).then((changeEmailAddressResponse) => {
      const changeEmailAddressResponseJson = JSON.parse(JSON.stringify(changeEmailAddressResponse));
      expect(changeEmailAddressResponseJson.companyEmailAddress).toEqual(TEST_EMAIL_EXISTING);
      expect(changeEmailAddressResponseJson.backUri).toEqual(BACK_LINK_PATH);
      expect(changeEmailAddressResponseJson.userEmail).toEqual(TEST_EMAIL_EXISTING);
      expect(changeEmailAddressResponseJson.title).toEqual(PAGE_TITLE);
    });
  });

  it("Registered email address update - company email missing in session", async () => {

    await changeEmailAddressHandler.get(request, response).then((changeEmailAddressResponse) => {
      const changeEmailAddressResponseJson = JSON.parse(JSON.stringify(changeEmailAddressResponse));
      expect(changeEmailAddressResponseJson.errors).toEqual(NO_EMAIL_ADDRESS_FOUND);
    });
  });
});

describe("Registered email address update - test POST method", () => {
  // clear down mocks
  beforeEach(() => {
    jest.clearAllMocks();
    changeEmailAddressHandler = new ChangeEmailAddressHandler(
      formValidator,
      TEST_EMAIL_EXISTING
    );
    // session instance
    session = new Session();
    // mock request/responses
    request = createRequest({
      session: session
    });
    response = createResponse();
  });

  it("No email in POST request body - return view data error", async () => {
    //set email address in request body to empty
    request.body.changeEmailAddress = "";

    await changeEmailAddressHandler.post(request, response).then((changeEmailAddressResponse) => {
      const changeEmailAddressResponseJson = JSON.parse(JSON.stringify(changeEmailAddressResponse));

      expect(changeEmailAddressResponseJson.errors).toBeTruthy;
      expect(changeEmailAddressResponseJson.backUri).toEqual(BACK_LINK_PATH);
      expect(changeEmailAddressResponseJson.errors.changeEmailAddress).toEqual(NO_EMAIL_ADDRESS_SUPPLIED);
    });
  });

  it("Updated email address supplied does not match expected patter - return view data error", async () => {
    //set email address in request body to invalid pattern
    request.body.changeEmailAddress = INVALID_EMAIL_ADDRESS;

    await changeEmailAddressHandler.post(request, response).then((changeEmailAddressResponse) => {
      const changeEmailAddressResponseJson = JSON.parse(JSON.stringify(changeEmailAddressResponse));

      expect(changeEmailAddressResponseJson.errors).toBeTruthy;
      expect(changeEmailAddressResponseJson.backUri).toEqual(BACK_LINK_PATH);
      expect(changeEmailAddressResponseJson.errors.changeEmailAddress).toEqual(EMAIL_ADDRESS_INVALID);
    });
  });

  it("Valid email address supplied", async () => {
    //set email address in request body to invalid pattern
    request.body.changeEmailAddress = TEST_EMAIL_UPDATE;

    await changeEmailAddressHandler.post(request, response).then((changeEmailAddressResponse) => {
      const changeEmailAddressResponseJson = JSON.parse(JSON.stringify(changeEmailAddressResponse));

      expect(changeEmailAddressResponseJson.errors).toBeFalsy;
      expect(changeEmailAddressResponseJson.backUri).toEqual(BACK_LINK_PATH);
      expect(changeEmailAddressResponseJson.userEmail).toEqual(TEST_EMAIL_EXISTING);
      expect(changeEmailAddressResponseJson.title).toEqual(PAGE_TITLE);
      expect(changeEmailAddressResponseJson.signoutBanner).toBeTruthy;
    });
  });
});
