import * as React from "react";

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
} from "../../lib/calendar-math.ts";
import { cn } from "../../lib/cn.ts";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { buttonVariants } from "./button.tsx";

/** A stretch of days, open at the far end while it is being picked. */
export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

/**
 * Which days cannot be picked. A list, a single day, a stretch with an open
 * end, or a rule of your own.
 */
export type DateMatcher =
  | boolean
  | Date
  | Date[]
  | { before?: Date | undefined; after?: Date | undefined }
  | ((date: Date) => boolean);

function matches(date: Date, matcher: DateMatcher | undefined): boolean {
  if (matcher === undefined) return false;
  if (typeof matcher === "boolean") return matcher;
  if (typeof matcher === "function") return matcher(date);
  if (matcher instanceof Date) return isSameDay(date, matcher);
  if (Array.isArray(matcher)) return matcher.some((one) => isSameDay(date, one));
  if (matcher.before !== undefined && isBefore(date, matcher.before)) return true;
  if (matcher.after !== undefined && isAfter(date, matcher.after)) return true;
  return false;
}

interface CalendarSharedProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "onSelect" | "defaultValue"> {
  /** The month on show. Leave it out and the calendar keeps it itself. */
  month?: Date | undefined;
  defaultMonth?: Date | undefined;
  onMonthChange?: ((month: Date) => void) | undefined;
  numberOfMonths?: number | undefined;
  /** Fill the first and last rows with the neighbouring months' days. */
  showOutsideDays?: boolean | undefined;
  disabled?: DateMatcher | undefined;
  /** 0 for Sunday, 1 for Monday. */
  weekStartsOn?: number | undefined;
  /** A month name and a year, or two dropdowns to jump about. */
  captionLayout?: "label" | "dropdown" | "dropdown-months" | "dropdown-years" | undefined;
  /** Earliest and latest month that can be reached. */
  startMonth?: Date | undefined;
  endMonth?: Date | undefined;
  /** Older spelling of the two above. */
  fromDate?: Date | undefined;
  toDate?: Date | undefined;
  /** Language for the month and weekday names, as "fr-FR" or "en-GB". */
  locale?: string | undefined;
  /** How the arrows on either side of the caption look. */
  buttonVariant?: "ghost" | "outline" | "secondary" | undefined;
  /** Override any part of the markup's classes. */
  classNames?: Partial<Record<CalendarPart, string>> | undefined;
}

type CalendarPart =
  | "months"
  | "month"
  | "caption"
  | "caption_label"
  | "nav"
  | "button_previous"
  | "button_next"
  | "table"
  | "weekdays"
  | "weekday"
  | "week"
  | "day"
  | "day_button";

export interface CalendarSingleProps extends CalendarSharedProps {
  mode?: "single" | undefined;
  selected?: Date | undefined;
  onSelect?: ((date: Date | undefined) => void) | undefined;
  /** Keep a day selected: clicking the chosen one no longer clears it. */
  required?: boolean | undefined;
}

export interface CalendarMultipleProps extends CalendarSharedProps {
  mode: "multiple";
  selected?: Date[] | undefined;
  onSelect?: ((dates: Date[] | undefined) => void) | undefined;
  min?: number | undefined;
  max?: number | undefined;
}

export interface CalendarRangeProps extends CalendarSharedProps {
  mode: "range";
  selected?: DateRange | undefined;
  onSelect?: ((range: DateRange | undefined) => void) | undefined;
}

export type CalendarProps = CalendarSingleProps | CalendarMultipleProps | CalendarRangeProps;

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(function Calendar(props, ref) {
  const {
    className,
    classNames,
    month,
    defaultMonth,
    onMonthChange,
    numberOfMonths = 1,
    showOutsideDays = true,
    disabled,
    weekStartsOn = 0,
    captionLayout = "label",
    startMonth,
    endMonth,
    fromDate,
    toDate,
    locale,
    buttonVariant = "ghost",
    mode: modeProp,
    selected: _selected,
    onSelect: _onSelect,
    required: _required,
    min: _min,
    max: _max,
    ...rest
  } = props as CalendarSharedProps & {
    mode?: "single" | "multiple" | "range";
    selected?: unknown;
    onSelect?: unknown;
    required?: boolean;
    min?: number;
    max?: number;
  };

  const mode = modeProp ?? "single";
  const first = startMonth ?? fromDate;
  const last = endMonth ?? toDate;

  const [displayed, setDisplayed] = useControllableState<Date>({
    prop: month,
    defaultProp: startOfMonth(defaultMonth ?? firstSelected(props) ?? new Date()),
    onChange: onMonthChange,
  });
  const current = startOfMonth(displayed ?? new Date());

  // The day the arrow keys are on. It doubles as the tab stop: the grid is one
  // stop for the Tab key, and the arrows move inside it.
  const [focused, setFocused] = React.useState<Date | null>(null);
  const [shouldFocus, setShouldFocus] = React.useState(false);
  const days = React.useRef(new Map<number, HTMLButtonElement>());

  React.useEffect(() => {
    if (!shouldFocus || focused === null) return;
    setShouldFocus(false);
    days.current.get(startOfDay(focused).getTime())?.focus();
  }, [shouldFocus, focused]);

  const monthFormat = React.useMemo(
    () => new Intl.DateTimeFormat(safeLocale(locale), { month: "long", year: "numeric" }),
    [locale],
  );
  const weekdayFormat = React.useMemo(
    () => new Intl.DateTimeFormat(safeLocale(locale), { weekday: "short" }),
    [locale],
  );
  const dayFormat = React.useMemo(
    () => new Intl.DateTimeFormat(safeLocale(locale), { dateStyle: "long" }),
    [locale],
  );
  const monthNameFormat = React.useMemo(
    () => new Intl.DateTimeFormat(safeLocale(locale), { month: "long" }),
    [locale],
  );

  const canGo = (months: number) => {
    const target = addMonths(current, months);
    if (first !== undefined && isBefore(endOfMonth(target), startOfMonth(first))) return false;
    if (last !== undefined && isAfter(startOfMonth(target), endOfMonth(last))) return false;
    return true;
  };

  const goTo = (months: number) => {
    if (!canGo(months)) return;
    setDisplayed(startOfMonth(addMonths(current, months)));
  };

  const isDisabled = (date: Date) => {
    if (matches(date, disabled)) return true;
    if (first !== undefined && isBefore(date, first)) return true;
    if (last !== undefined && isAfter(date, last)) return true;
    return false;
  };

  const selection = readSelection(props, mode);

  const pick = (date: Date) => {
    if (isDisabled(date)) return;
    const day = startOfDay(date);

    if (mode === "multiple") {
      const { onSelect, selected, max } = props as CalendarMultipleProps;
      const list = selected ?? [];
      const without = list.filter((one) => !isSameDay(one, day));
      if (without.length !== list.length) {
        onSelect?.(without);
        return;
      }
      if (max !== undefined && list.length >= max) return;
      onSelect?.([...list, day].sort(compareDays));
      return;
    }

    if (mode === "range") {
      const { onSelect, selected } = props as CalendarRangeProps;
      const from = selected?.from;
      const to = selected?.to;
      // A first click opens a range, a second closes it, a third starts over.
      if (from === undefined || to !== undefined) {
        onSelect?.({ from: day, to: undefined });
        return;
      }
      onSelect?.(isBefore(day, from) ? { from: day, to: from } : { from, to: day });
      return;
    }

    const { onSelect, selected, required } = props as CalendarSingleProps;
    if (selected !== undefined && isSameDay(selected, day) && required !== true) {
      onSelect?.(undefined);
      return;
    }
    onSelect?.(day);
  };

  /** Moves the arrow-key focus, following it into the next month if needed. */
  const moveFocus = (from: Date, days: number) => {
    const target = addDays(from, days);
    if (first !== undefined && isBefore(target, first)) return;
    if (last !== undefined && isAfter(target, last)) return;
    if (!isSameMonth(target, current) && numberOfMonths === 1) {
      setDisplayed(startOfMonth(target));
    } else if (isBefore(target, current)) {
      setDisplayed(startOfMonth(target));
    } else if (isAfter(target, endOfMonth(addMonths(current, numberOfMonths - 1)))) {
      setDisplayed(startOfMonth(addMonths(target, -(numberOfMonths - 1))));
    }
    setFocused(target);
    setShouldFocus(true);
  };

  const onDayKeyDown = (date: Date) => (event: React.KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    const step = moves[event.key];
    if (step !== undefined) {
      event.preventDefault();
      moveFocus(date, step);
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const order = weekdayOrder(weekStartsOn);
      const position = order.indexOf(date.getDay());
      moveFocus(date, event.key === "Home" ? -position : 6 - position);
      return;
    }
    if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      const target = addMonths(date, event.key === "PageUp" ? -1 : 1);
      setDisplayed(startOfMonth(target));
      setFocused(target);
      setShouldFocus(true);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pick(date);
    }
  };

  const months = Array.from({ length: Math.max(1, numberOfMonths) }, (_, index) =>
    startOfMonth(addMonths(current, index)),
  );

  // Only one day is reachable with Tab: the one the arrows are on, else the
  // selection, else today, else the first of the month.
  const tabStop = (() => {
    if (focused !== null) return startOfDay(focused);
    const chosen = selection.anchor;
    if (chosen !== undefined && months.some((one) => isSameMonth(chosen, one))) {
      return startOfDay(chosen);
    }
    const today = startOfDay(new Date());
    if (months.some((one) => isSameMonth(today, one))) return today;
    return months[0] as Date;
  })();

  const showDropdownMonths = captionLayout === "dropdown" || captionLayout === "dropdown-months";
  const showDropdownYears = captionLayout === "dropdown" || captionLayout === "dropdown-years";

  return (
    <div
      ref={ref}
      data-slot="calendar"
      className={cn("bg-background p-3 [--cell-size:2rem]", className)}
      {...(rest as React.ComponentPropsWithoutRef<"div">)}
    >
      <div className={cn("flex flex-col gap-4 sm:flex-row", classNames?.months)}>
        {months.map((monthDate, monthIndex) => (
          <div
            key={monthDate.getTime()}
            data-slot="calendar-month"
            className={cn("flex w-full flex-col gap-4", classNames?.month)}
          >
            <div
              data-slot="calendar-caption"
              className={cn("relative flex h-[var(--cell-size)] items-center justify-center", classNames?.caption)}
            >
              {monthIndex === 0 ? (
                <button
                  type="button"
                  aria-label="Previous month"
                  disabled={!canGo(-1)}
                  onClick={() => goTo(-1)}
                  data-slot="calendar-previous"
                  className={cn(
                    buttonVariants({ variant: buttonVariant }),
                    "absolute left-0 size-[var(--cell-size)] p-0",
                    classNames?.button_previous,
                  )}
                >
                  <ChevronIcon direction="left" />
                </button>
              ) : null}

              {showDropdownMonths || showDropdownYears ? (
                <div className="flex items-center gap-1">
                  {showDropdownMonths ? (
                    <CaptionSelect
                      label="Month"
                      value={String(monthDate.getMonth())}
                      onChange={(next) =>
                        setDisplayed(new Date(monthDate.getFullYear(), Number(next), 1))
                      }
                      options={Array.from({ length: 12 }, (_, index) => ({
                        value: String(index),
                        label: monthNameFormat.format(new Date(2020, index, 1)),
                      }))}
                    />
                  ) : null}
                  {showDropdownYears ? (
                    <CaptionSelect
                      label="Year"
                      value={String(monthDate.getFullYear())}
                      onChange={(next) =>
                        setDisplayed(new Date(Number(next), monthDate.getMonth(), 1))
                      }
                      options={yearOptions(monthDate, first, last)}
                    />
                  ) : null}
                </div>
              ) : (
                <div
                  aria-live="polite"
                  data-slot="calendar-caption-label"
                  className={cn("text-sm font-medium", classNames?.caption_label)}
                >
                  {monthFormat.format(monthDate)}
                </div>
              )}

              {monthIndex === months.length - 1 ? (
                <button
                  type="button"
                  aria-label="Next month"
                  disabled={!canGo(1)}
                  onClick={() => goTo(1)}
                  data-slot="calendar-next"
                  className={cn(
                    buttonVariants({ variant: buttonVariant }),
                    "absolute right-0 size-[var(--cell-size)] p-0",
                    classNames?.button_next,
                  )}
                >
                  <ChevronIcon direction="right" />
                </button>
              ) : null}
            </div>

            <table
              role="grid"
              aria-label={monthFormat.format(monthDate)}
              data-slot="calendar-table"
              className={cn("w-full border-collapse", classNames?.table)}
            >
              <thead>
                <tr className={cn("flex", classNames?.weekdays)}>
                  {weekdayOrder(weekStartsOn).map((weekday) => {
                    // Any week works: 2024-01-07 is a Sunday.
                    const sample = new Date(2024, 0, 7 + weekday);
                    return (
                      <th
                        key={weekday}
                        scope="col"
                        abbr={weekdayFormat.format(sample)}
                        className={cn(
                          "flex-1 select-none rounded-md text-[0.8rem] font-normal text-muted-foreground",
                          classNames?.weekday,
                        )}
                      >
                        {weekdayFormat.format(sample).slice(0, 2)}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {buildMonthGrid({ month: monthDate, weekStartsOn }).map((week) => (
                  <tr
                    key={week[0]?.date.getTime()}
                    className={cn("mt-2 flex w-full", classNames?.week)}
                  >
                    {week.map((cell) => {
                      const state = dayState(cell.date, selection, mode);
                      const outside = cell.outside;
                      const hidden = outside && !showOutsideDays;
                      const off = isDisabled(cell.date);
                      const today = isSameDay(cell.date, new Date());

                      return (
                        <td
                          key={cell.date.getTime()}
                          role="gridcell"
                          data-slot="calendar-day"
                          className={cn(
                            "relative flex-1 p-0 text-center",
                            state.middle && "bg-accent first:rounded-l-md last:rounded-r-md",
                            state.start && "rounded-l-md",
                            state.end && "rounded-r-md",
                            classNames?.day,
                          )}
                        >
                          {hidden ? (
                            <span className="block size-[var(--cell-size)]" aria-hidden="true" />
                          ) : (
                            <button
                              type="button"
                              ref={(node) => {
                                const key = cell.date.getTime();
                                if (node === null) days.current.delete(key);
                                else days.current.set(key, node);
                              }}
                              tabIndex={isSameDay(cell.date, tabStop) ? 0 : -1}
                              aria-label={dayFormat.format(cell.date)}
                              aria-selected={state.selected || undefined}
                              aria-current={today ? "date" : undefined}
                              aria-disabled={off || undefined}
                              disabled={off}
                              data-slot="calendar-day-button"
                              data-selected={state.selected ? "" : undefined}
                              data-today={today ? "" : undefined}
                              data-outside={outside ? "" : undefined}
                              data-range-start={state.start ? "" : undefined}
                              data-range-end={state.end ? "" : undefined}
                              data-range-middle={state.middle ? "" : undefined}
                              onClick={() => {
                                setFocused(cell.date);
                                pick(cell.date);
                              }}
                              onKeyDown={onDayKeyDown(cell.date)}
                              onFocus={() => setFocused(cell.date)}
                              className={cn(
                                "flex size-[var(--cell-size)] w-full items-center justify-center",
                                "rounded-md p-0 text-sm font-normal",
                                // deliberate divergence from shadcn: a clickable control shows a pointer
                                "cursor-pointer select-none",
                                "transition-[color,background-color,box-shadow] duration-[160ms] ease-out",
                                "hover:bg-accent hover:text-accent-foreground",
                                "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                                "disabled:pointer-events-none disabled:opacity-50",
                                outside && "text-muted-foreground",
                                today && !state.selected && "bg-accent text-accent-foreground",
                                state.middle && "rounded-none bg-transparent hover:bg-accent/60",
                                state.selected &&
                                  !state.middle &&
                                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                                state.start && "rounded-l-md rounded-r-none",
                                state.end && "rounded-r-md rounded-l-none",
                                classNames?.day_button,
                              )}
                            >
                              {cell.date.getDate()}
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
});

function CaptionSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        "h-8 cursor-pointer rounded-md border bg-background px-2 text-sm font-medium",
        "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function yearOptions(month: Date, first: Date | undefined, last: Date | undefined) {
  const start = first?.getFullYear() ?? month.getFullYear() - 100;
  const end = last?.getFullYear() ?? month.getFullYear() + 10;
  const from = Math.min(start, month.getFullYear());
  const to = Math.max(end, month.getFullYear());
  return Array.from({ length: to - from + 1 }, (_, index) => ({
    value: String(from + index),
    label: String(from + index),
  }));
}

/** `Intl` throws on a locale it cannot read; a date-fns object is one of those. */
function safeLocale(locale: string | undefined): string | undefined {
  if (typeof locale !== "string" || locale.length === 0) return undefined;
  try {
    new Intl.DateTimeFormat(locale);
    return locale;
  } catch {
    return undefined;
  }
}

interface Selection {
  anchor: Date | undefined;
  days: Date[];
  range: DateRange | undefined;
}

function firstSelected(props: CalendarProps): Date | undefined {
  return readSelection(props, (props as { mode?: string }).mode ?? "single").anchor;
}

function readSelection(props: CalendarProps, mode: string): Selection {
  if (mode === "multiple") {
    const days = (props as CalendarMultipleProps).selected ?? [];
    return { anchor: days[0], days, range: undefined };
  }
  if (mode === "range") {
    const range = (props as CalendarRangeProps).selected;
    return { anchor: range?.from, days: [], range };
  }
  const one = (props as CalendarSingleProps).selected;
  return { anchor: one, days: one === undefined ? [] : [one], range: undefined };
}

function dayState(date: Date, selection: Selection, mode: string) {
  if (mode === "range") {
    const from = selection.range?.from;
    const to = selection.range?.to;
    const start = from !== undefined && isSameDay(date, from);
    const end = to !== undefined && isSameDay(date, to);
    const inside = isInRange(date, from, to);
    return {
      selected: start || end || inside,
      start: start && to !== undefined,
      end: end && from !== undefined,
      middle: inside && !start && !end,
    };
  }
  return {
    selected: selection.days.some((one) => isSameDay(one, date)),
    start: false,
    end: false,
    middle: false,
  };
}

export { Calendar };
