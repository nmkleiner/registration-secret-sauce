import { Program } from '../../../excel-registration-front/src/Modules/Onward/Interfaces/program.interface';

export type PaymentStatus = 'Unpaid' | 'Paid';

export interface ApplicationData {
  EXCEL: {
    isMainPhaseComplete: boolean;
    hasFullLoginUrl: boolean;
    eligibility: string;
    isAssigned: boolean;
    applicationStatus: string;
    activationStatus: string;
    isPhase2Application: boolean;
    isPhase2Completed: null;
    hasApplicationBeenSubmitted: boolean;
    phase1AllowSubmission: boolean;
    phase2AllowSubmission: boolean;
    payment: PaymentData;
    currentRecruiter: {
      partner_id: string;
      organizer_id: string;
      organizerSFId: string;
      partnerSFId: string;
    };
  };
  ONWARD: {
    payment: PaymentData;
    finalEligibility: string;
    hasLivingParent: boolean;
    phase1AllowSubmission: boolean;
    isPhase2Application: boolean;
    applicationTripOfferings: OnwardApplicationPrograms;
    dataForAlgorithmPrograms: DataForAlgorithmPrograms;
    isAllowChangeOnwardTrip: boolean;
    applicationStatus: string;
    askControlQuestions: boolean;
  };
}

export interface OnwardApplicationPrograms {
  onwardPrograms: Program[];
  notRelevantOnwardPrograms: Program[];
}

export interface DataForAlgorithmPrograms {
  gender: string;
  studentValue: string;
  campusId: string;
  peerQuestionValue: string;
  isAllowAlumniRegistration: boolean;
}

export interface PaymentData {
  date: string;
  status: PaymentStatus;
  allowPayment: boolean;
}
