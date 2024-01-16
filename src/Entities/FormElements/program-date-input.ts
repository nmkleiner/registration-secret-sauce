import dayjs from "dayjs";
import { i18n } from "../../../../excel-registration-front/src/Core/Translations/vue-i18n";
import { Program } from "registration-secret-sauce";
import { AppDate } from "registration-secret-sauce";

export class ProgramDateInput {
  public monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  public inputTitle = i18n.global.t("programTab.startDateTitle");
  public datePickerOpen = false;
  public availablePrograms = [] as Program[];
  public sortedAvailableDates = [] as string[];
  public sortedAvailableMonths = ({} = new Set<number>());
  public sortedAvailableYears = ({} = new Set<number>());
  public currentDate: AppDate = { month: "", year: "", day: "" };
  public lockPrevious = true;
  public lockNext = false;
  public selectedDate = "";
  public availableDaysInCurrentMonth = [] as number[];
  public readonly = false;

  constructor(availablePrograms: Program[], isReadOnly = false) {
    this.availablePrograms = availablePrograms;
    this.readonly = isReadOnly;
    this.sortedAvailableDates = this.initializeDates();
    this.sortedAvailableMonths = this.initializeMonths();
    this.sortedAvailableYears = this.initializeYears();
    this.currentDate = this.initializeCurrentDate();
    this.updateLockNext();
    this.updateAvailableDaysInCurrentMonth();
    this.checkForOneAvailableDateOnly();
  }

  public updateCurrentDate(currentDate: AppDate): void {
    this.currentDate = currentDate;
    this.updateLockNext();
    this.updateLockPrevious();
    this.updateAvailableDaysInCurrentMonth();
  }
  public openDatePicker(): void {
    this.datePickerOpen = true;
  }
  public closeDatePicker(): void {
    this.datePickerOpen = false;
  }
  public toggleDatePicker(): void {
    this.datePickerOpen = !this.datePickerOpen;
  }

  public updateSelectedDate(selectedDay: string): void {
    this.currentDate.day = selectedDay;
    this.selectedDate = this.getSelectedDateLabel();
    this.lockPrevious = true;
    this.lockNext = true;
    this.availableDaysInCurrentMonth = this.availableDaysInCurrentMonth.filter(
      (day) => day.toString() === selectedDay
    );
  }

  public getCurrentDateLabel(): string {
    return `${this.monthNames[Number(this.currentDate.month) - 1]}, ${
      this.currentDate.year
    }`;
  }

  public getSelectedDateLabel(): string {
    return `${this.monthNames[Number(this.currentDate.month) - 1]} ${
      this.currentDate.day
    }, ${this.currentDate.year}`;
  }

  private checkForOneAvailableDateOnly(): void {
    // Case of one available date only - update the selected date
    if (this.sortedAvailableDates.length === 1) {
      this.updateSelectedDate(
        dayjs(this.sortedAvailableDates[0], "YYYY/MMMM/DD").date()?.toString()
      );
    }
  }

  private updateLockNext(): void {
    this.lockNext = !Array.from(this.sortedAvailableMonths).find(
      (month) => month > Number(this.currentDate.month)
    );
  }

  private updateLockPrevious(): void {
    this.lockPrevious = !Array.from(this.sortedAvailableMonths).find(
      (month) => month < Number(this.currentDate.month)
    );
  }

  private initializeDates(): string[] {
    const sortedProgramsByDates = this.availablePrograms.sort(
      (program1: Program, program2: Program) => {
        return (
          (dayjs(program1.tripFromDate) as any) -
          (dayjs(program2.tripFromDate) as any)
        );
      }
    );
    return sortedProgramsByDates.map((program) => {
      return dayjs(program.tripFromDate).format("YYYY/MMMM/DD");
    });
  }

  private initializeMonths(): Set<number> {
    const months = new Set<number>();
    this.sortedAvailableDates.map((date) => {
      months.add(dayjs(date, "YYYY/MMMM/DD").month() + 1);
    });
    return months;
  }

  private initializeYears(): Set<number> {
    const years = new Set<number>();
    this.sortedAvailableDates.map((date) => {
      years.add(dayjs(date, "YYYY/MMMM/DD").year());
    });
    return years;
  }

  private initializeCurrentDate(): AppDate {
    return {
      month: Array.from(this.sortedAvailableMonths)[0].toString(),
      year: Array.from(this.sortedAvailableYears)[0].toString(),
      day: "",
    };
  }

  private updateAvailableDaysInCurrentMonth(): void {
    const availableDays = [] as number[];
    this.sortedAvailableDates.map((date) => {
      if (
        (dayjs(date, "YYYY/MMMM/DD").month() + 1).toString() ===
        this.currentDate.month
      ) {
        availableDays.push(dayjs(date, "YYYY/MMMM/DD").get("date"));
      }
    });
    this.availableDaysInCurrentMonth = availableDays;
  }
}
