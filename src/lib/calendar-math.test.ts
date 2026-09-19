import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  addDays,
  addMonths,
  buildMonthGrid,
  compareDays,
  endOfMonth,
  isAfter,
  isBefore,
  isInRange,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  weekdayOrder,
} from "./calendar-math.ts";

const day = (year: number, month: number, date: number) => new Date(year, month - 1, date);

describe("startOfDay", () => {
  it("drops the time", () => {
    const noon = new Date(2026, 8, 19, 12, 34, 56, 789);
    const midnight = startOfDay(noon);
    assert.equal(midnight.getHours(), 0);
    assert.equal(midnight.getMinutes(), 0);
    assert.equal(midnight.getDate(), 19);
  });
});

describe("isSameDay", () => {
  it("ignores the time of day", () => {
    assert.equal(isSameDay(new Date(2026, 8, 19, 1), new Date(2026, 8, 19, 23)), true);
  });

  it("tells neighbouring days apart", () => {
    assert.equal(isSameDay(day(2026, 9, 19), day(2026, 9, 20)), false);
  });

  it("does not confuse the same day of another month or year", () => {
    assert.equal(isSameDay(day(2026, 9, 19), day(2026, 10, 19)), false);
    assert.equal(isSameDay(day(2026, 9, 19), day(2025, 9, 19)), false);
  });
});

describe("isSameMonth", () => {
  it("compares month and year together", () => {
    assert.equal(isSameMonth(day(2026, 9, 1), day(2026, 9, 30)), true);
    assert.equal(isSameMonth(day(2026, 9, 1), day(2025, 9, 1)), false);
  });
});

describe("addDays", () => {
  it("walks forwards and backwards", () => {
    assert.equal(isSameDay(addDays(day(2026, 9, 19), 3), day(2026, 9, 22)), true);
    assert.equal(isSameDay(addDays(day(2026, 9, 19), -20), day(2026, 8, 30)), true);
  });

  it("crosses a month end", () => {
    assert.equal(isSameDay(addDays(day(2026, 1, 31), 1), day(2026, 2, 1)), true);
  });

  it("crosses a leap day", () => {
    assert.equal(isSameDay(addDays(day(2024, 2, 28), 1), day(2024, 2, 29)), true);
    assert.equal(isSameDay(addDays(day(2025, 2, 28), 1), day(2025, 3, 1)), true);
  });
});

describe("addMonths", () => {
  it("keeps the day of the month", () => {
    assert.equal(isSameDay(addMonths(day(2026, 9, 19), 1), day(2026, 10, 19)), true);
    assert.equal(isSameDay(addMonths(day(2026, 9, 19), -1), day(2026, 8, 19)), true);
  });

  it("pulls back to the last day when the month is too short", () => {
    assert.equal(isSameDay(addMonths(day(2026, 1, 31), 1), day(2026, 2, 28)), true);
    assert.equal(isSameDay(addMonths(day(2024, 1, 31), 1), day(2024, 2, 29)), true);
  });

  it("crosses the year", () => {
    assert.equal(isSameDay(addMonths(day(2026, 12, 15), 1), day(2027, 1, 15)), true);
  });
});

describe("startOfMonth and endOfMonth", () => {
  it("finds both ends", () => {
    assert.equal(isSameDay(startOfMonth(day(2026, 9, 19)), day(2026, 9, 1)), true);
    assert.equal(isSameDay(endOfMonth(day(2026, 9, 19)), day(2026, 9, 30)), true);
    assert.equal(isSameDay(endOfMonth(day(2026, 2, 5)), day(2026, 2, 28)), true);
    assert.equal(isSameDay(endOfMonth(day(2024, 2, 5)), day(2024, 2, 29)), true);
  });
});

describe("compareDays, isBefore, isAfter", () => {
  it("orders two days", () => {
    assert.ok(compareDays(day(2026, 9, 18), day(2026, 9, 19)) < 0);
    assert.ok(compareDays(day(2026, 9, 20), day(2026, 9, 19)) > 0);
    assert.equal(compareDays(day(2026, 9, 19), day(2026, 9, 19)), 0);
  });

  it("ignores the time of day", () => {
    const morning = new Date(2026, 8, 19, 8);
    const evening = new Date(2026, 8, 19, 20);
    assert.equal(isBefore(morning, evening), false);
    assert.equal(isAfter(evening, morning), false);
  });
});

describe("isInRange", () => {
  it("includes both ends", () => {
    assert.equal(isInRange(day(2026, 9, 10), day(2026, 9, 10), day(2026, 9, 20)), true);
    assert.equal(isInRange(day(2026, 9, 20), day(2026, 9, 10), day(2026, 9, 20)), true);
    assert.equal(isInRange(day(2026, 9, 15), day(2026, 9, 10), day(2026, 9, 20)), true);
  });

  it("leaves the days outside out", () => {
    assert.equal(isInRange(day(2026, 9, 9), day(2026, 9, 10), day(2026, 9, 20)), false);
    assert.equal(isInRange(day(2026, 9, 21), day(2026, 9, 10), day(2026, 9, 20)), false);
  });

  it("copes with the ends given the wrong way round", () => {
    assert.equal(isInRange(day(2026, 9, 15), day(2026, 9, 20), day(2026, 9, 10)), true);
  });

  it("is false while the range is incomplete", () => {
    assert.equal(isInRange(day(2026, 9, 15), day(2026, 9, 10), undefined), false);
    assert.equal(isInRange(day(2026, 9, 15), undefined, undefined), false);
  });
});

describe("buildMonthGrid", () => {
  it("lays September 2026 out in full weeks", () => {
    const weeks = buildMonthGrid({ month: day(2026, 9, 15) });
    assert.ok(weeks.length >= 4 && weeks.length <= 6);
    for (const week of weeks) assert.equal(week.length, 7);
  });

  it("starts the week on the day it is told to", () => {
    const sunday = buildMonthGrid({ month: day(2026, 9, 15), weekStartsOn: 0 });
    const monday = buildMonthGrid({ month: day(2026, 9, 15), weekStartsOn: 1 });
    assert.equal(sunday[0]?.[0]?.date.getDay(), 0);
    assert.equal(monday[0]?.[0]?.date.getDay(), 1);
  });

  it("marks the days borrowed from the months on either side", () => {
    const weeks = buildMonthGrid({ month: day(2026, 9, 15) });
    const flat = weeks.flat();
    const inside = flat.filter((cell) => !cell.outside);
    assert.equal(inside.length, 30);
    assert.equal(isSameDay(inside[0]!.date, day(2026, 9, 1)), true);
    assert.equal(isSameDay(inside[inside.length - 1]!.date, day(2026, 9, 30)), true);
  });

  it("runs from one day to the next without a gap", () => {
    const flat = buildMonthGrid({ month: day(2026, 2, 10) }).flat();
    for (let index = 1; index < flat.length; index += 1) {
      assert.equal(isSameDay(flat[index]!.date, addDays(flat[index - 1]!.date, 1)), true);
    }
  });

  it("gives February 2026 exactly four weeks when it starts on a Sunday", () => {
    // 1 February 2026 is a Sunday and the month has 28 days.
    const weeks = buildMonthGrid({ month: day(2026, 2, 10), weekStartsOn: 0 });
    assert.equal(weeks.length, 4);
    assert.equal(weeks.flat().every((cell) => !cell.outside), true);
  });

  it("holds a month that needs six rows", () => {
    // 1 August 2026 is a Saturday, so the 31 days spill into a sixth row.
    const weeks = buildMonthGrid({ month: day(2026, 8, 10), weekStartsOn: 0 });
    assert.equal(weeks.length, 6);
  });
});

describe("weekdayOrder", () => {
  it("lists the days from the chosen start", () => {
    assert.deepEqual(weekdayOrder(0), [0, 1, 2, 3, 4, 5, 6]);
    assert.deepEqual(weekdayOrder(1), [1, 2, 3, 4, 5, 6, 0]);
    assert.deepEqual(weekdayOrder(6), [6, 0, 1, 2, 3, 4, 5]);
  });
});
