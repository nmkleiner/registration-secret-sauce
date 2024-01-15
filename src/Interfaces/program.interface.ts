export interface Program {
  tripDuration: string;
  tripFromDate: string;
  tripName: string;
  tripSeasonId: number;
  oprDetails: string;
  oprIsAvailableForStudents: 0 | 1;
  oprIsPriority: 0 | 1;
  oprLocationCitiesName: string;
  oprParticipantFee: string;
  oprRequirements: string;
  oprSkills: string;
  programId: number;
  programName: string;
  subProgramName: string;
  programDurationNameText: string;
  tdmId: number;
  oprIsByInvitationOnly: 0 | 1;
  isPrimary?: 0 | 1;
  isVisibleInMarket: 0 | 1;
  organizerId: number;
  partnerId: number;
  tripLanguage: string;
  tripRangeAge: string;
  tripFromAge: number;
  tripToAge: number;
  tripOrganizerName: string;
  programPriority: number;
}

export interface PayloadProgramData {
  gender: string;
  campusId: string;
  seasonCodes: number[];
  dateOfBirth: string;
  isStudent: boolean;
  applicationId: string;
  countryIsoCode: string;
  mockNoPrograms: boolean;
  isPeerFromUniversity: boolean;
  isAllowAlumniRegistration: boolean;
}
