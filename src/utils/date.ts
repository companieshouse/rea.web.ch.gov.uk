import { DateTime } from "luxon";
import { createAndLogError } from "../lib/Logger";
import { SOMETHING_HAS_GONE_WRONG } from "../constants/app.const";

export const toReadableFormat = (dateToConvert: string): string => {
  if (!dateToConvert) {
    return "";
  }
  const jsDate = new Date(dateToConvert);
  const dateTime = DateTime.fromJSDate(jsDate);
  const convertedDate = dateTime.toFormat("d MMMM yyyy");

  if (convertedDate === "Invalid DateTime") {
    throw createAndLogError( SOMETHING_HAS_GONE_WRONG, `Unable to convert provided date ${dateToConvert}`);
  }

  return convertedDate;
};

export const isInFuture = (dateToCheckISO: string): boolean => {
  const today: DateTime = DateTime.now();
  const dateToCheck: DateTime = DateTime.fromISO(dateToCheckISO);
  const timeUnitDay = "day";

  return dateToCheck.startOf(timeUnitDay) > today.startOf(timeUnitDay);
};

export const toReadableFormatMonthYear = (monthNum: number, year: number): string => {
  const datetime = DateTime.fromObject({ month: monthNum });
  const convertedMonth = datetime.toFormat("MMMM");

  if (convertedMonth === "Invalid DateTime") {
    throw createAndLogError( SOMETHING_HAS_GONE_WRONG, `toReadableFormatMonthYear() - Unable to convert provided month ${monthNum}`);
  }

  return `${convertedMonth} ${year}`;
};
