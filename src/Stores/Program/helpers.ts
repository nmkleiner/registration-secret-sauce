import { groupBy } from "lodash-es";
import { useSeasonStore } from "../../../../../../registration-secret-sauce/src/Stores/Stores/Season/season.store";
import { Program } from "../../Interfaces";

export function getProgramsDates(programs: Program[]): string {
  if (programs.length) {
    const dates = Object.keys(groupBy(programs, "tripFromDate"));
    if (dates.length > 1) {
      return "multiple";
    }
    return dates[0];
  }
}

export function getProgramsDurations(programs: Program[]): string {
  if (programs.length) {
    const durations = Object.keys(groupBy(programs, "tripDuration"));
    const durationOptions = durations.map((duration) =>
      parseInt(duration.split(" ")[0])
    );
    if (durationOptions.length > 1) {
      return `${Math.min(...durationOptions).toFixed(0)} - ${Math.max(
        ...durationOptions
      ).toFixed(0)}`;
    }
    return durationOptions[0].toString();
  }
}

export function getProgramsLocations(programs: Program[]): string {
  if (programs.length) {
    const locations = Object.keys(groupBy(programs, "oprLocationCitiesName"));
    if (locations.length > 1) {
      return "multiple";
    }
    return locations[0];
  }
}

export function getProgramsFees(programs: Program[]): string {
  if (programs.length) {
    const fees = Object.keys(groupBy(programs, "oprParticipantFee"));
    const feeOptions = fees.map((fee) => parseInt(fee));

    if (feeOptions.length > 1) {
      return `$${Math.min(...feeOptions)} - $${Math.max(...feeOptions)}`;
    }
    return `$${feeOptions[0]}`;
  }
}

export function getProgramPriority(program: Program): number {
  switch (program.programId) {
    case OnwardTypeProgramEnum.VOLUNTEERING:
      return 1;
    case OnwardTypeProgramEnum.FELLOWSHIP:
      return 2;
    case OnwardTypeProgramEnum.REMOTE_WORK:
      return 3;
  }
}

export function getSelectedProgramsData(
  selectedPrograms: Program[],
  data: UpdateOnwardApplicantDto
): UpdateOnwardApplicantDto {
  const applicationSeason = useSeasonStore().applicationSeason;
  const urlParams = buildUrlParams();

  if (selectedPrograms.length === 1) {
    const selectedProgramData = {
      ...data,
      tripOfferingId: selectedPrograms[0].tdmId,
    };
    if (applicationSeason.seasonCode !== selectedPrograms[0].tripSeasonId) {
      return {
        ...selectedProgramData,
        seasonSettingId: getSeasonSettingSFId(selectedPrograms[0].tripSeasonId),
        urlParams,
      };
    }
    return selectedProgramData;
  } else {
    const primaryTrip = selectedPrograms.reduce(
      (prevProgram, currentProgram) => {
        return prevProgram.programPriority < currentProgram.programPriority
          ? prevProgram
          : currentProgram;
      }
    );
    const secondaryTrips = selectedPrograms.filter(
      (program) => program.tdmId !== primaryTrip.tdmId
    );
    const secondaryTripChoices: OnwardSecondaryTripChoice[] = [];
    secondaryTrips.forEach((program) => {
      secondaryTripChoices.push({
        priority: program.programPriority,
        value: program.tdmId,
        isSelected: true,
      });
    });

    const selectedProgramsData = {
      ...data,
      tripOfferingId: primaryTrip.tdmId,
      secondaryTripChoices,
    };
    if (applicationSeason.seasonCode !== primaryTrip.tripSeasonId) {
      return {
        ...selectedProgramsData,
        seasonSettingId: getSeasonSettingSFId(primaryTrip.tripSeasonId),
        urlParams,
      };
    }
    return selectedProgramsData;
  }
}

function getSeasonSettingSFId(seasonCode: number): string {
  const availableSeasons = useSeasonStore().availableSeasons;
  return availableSeasons?.find((season) => season.id === seasonCode)?.value;
}
