import { BasicInput } from "./index";
import { RawQuestion } from "registration-secret-sauce";
import { useFormatDates } from "../../../../excel-registration-front/src/Core/Composables/dayJs/useFormatDates";
import { useCountryStore } from "../../../../../../registration-secret-sauce/src/Stores/Stores/Country/country.store";
import { BaseSectionInterface } from "../Section/section.interface";
import { AppDate } from "registration-secret-sauce";
import z from "zod";
import dayjs from "dayjs";
import { last } from "lodash-es";

const { formatDate } = useFormatDates();

export class DateInput extends BasicInput {
  public datePickerOpen = false;
  public monthListOpen = false;
  public yearListOpen = false;
  public selectedDate: AppDate = { month: "", year: "", day: "" };
  public months = this.initializeMonths();
  public years = this.initializeYears();
  private salesforceFormat = "YYYY-MM-DD";
  private displayFormat = useCountryStore().dateFormat;

  constructor(rawQuestion: RawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);

    this.selectedDate = this.transformToAppDate(this.value);
    this.value = this.transformDateFormat(this.value);
  }

  public updateDateFormat(dateFormat: string): void {
    this.rules.dateFormat = dateFormat;
    this.displayFormat = dateFormat;
  }

  public getValueForAnswer(): string {
    return formatDate(this.value, this.displayFormat, this.salesforceFormat);
  }

  public get displayValue(): string {
    if (!this.selectedDate.day) {
      return "";
    }

    return formatDate(
      `${this.selectedDate.year}-${this.selectedDate.month}-${this.selectedDate.day}`,
      "YYYY-M-D",
      this.displayFormat
    );
  }

  public openDatePicker(): void {
    if (this.readonly) {
      return;
    }
    this.datePickerOpen = true;
  }

  public closeDatePicker(): void {
    this.datePickerOpen = false;
  }

  public toggleYearListOpen(): void {
    this.yearListOpen = !this.yearListOpen;
  }

  public toggleMonthListOpen(): void {
    this.monthListOpen = !this.monthListOpen;
  }

  public get firstYearInRange(): boolean {
    const firstYear = this.years[0];
    return this.selectedDate.year === String(firstYear);
  }

  public get lastYearInRange(): boolean {
    const lastYear = last(this.years);
    return this.selectedDate.year === String(lastYear);
  }

  public get firstMonthInRange(): boolean {
    const firstMonth = this.months[0];
    return (
      this.selectedDate.month === String(firstMonth) && this.firstYearInRange
    );
  }

  public get lastMonthInRange(): boolean {
    const lastMonth = dayjs().month() + 1;
    return (
      this.selectedDate.month === String(lastMonth) && this.lastYearInRange
    );
  }

  public updateSelectedDate(date: AppDate) {
    if (date.year && z.string().length(4).parse(date.year)) {
      this.selectedDate.year = date.year;
    }
    if (date.month && z.string().max(2).parse(date.month)) {
      this.selectedDate.month = date.month;
    }
    if ((date.day && z.string().max(2).parse(date.day)) || date.day === "") {
      this.selectedDate.day = date.day;
    }
    if (
      this.selectedDate.year &&
      this.selectedDate.month &&
      this.selectedDate.day
    ) {
      this.value = this.displayValue;
    }
  }

  private transformToAppDate(value: string): AppDate {
    if (!value) {
      return {
        month: dayjs().format("M"),
        year: dayjs().format("YYYY"),
        day: "",
      }; // today's date
    }

    return {
      year: formatDate(value, this.salesforceFormat, "YYYY"),
      month: formatDate(value, this.salesforceFormat, "M"),
      day: formatDate(value, this.salesforceFormat, "D"),
    };
  }

  private transformDateFormat(value: string): string {
    if (!value) {
      return "";
    }

    return formatDate(value, this.salesforceFormat, this.displayFormat);
  }

  private initializeYears(): number[] {
    const startYear = new Date().getFullYear() - 100;
    const endYear = new Date().getFullYear() + 50;

    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => i + startYear
    );
  }
  private initializeMonths(): number[] {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }
}
