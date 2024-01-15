import { PaymentStatus } from '@paypal/paypal-js';

export type SaveSectionResponse = ExcelSaveSectionResponse | OnwardSaveSectionResponse;

export interface ExcelSaveSectionResponse {
  type: 'EXCEL';
  application: {
    Id: string;
    Final_Eligibility__c: string;
    Payment_Status__c: PaymentStatus;
    Phase_1_Allow_Submission__c: boolean;
    Phase_2_Allow_Submission__c: boolean;
    Phase_2_Submission_Date__c: string | null;
    Submission_Date__c: string | null;
    Transaction_Donation__c: string;
    Transaction_Refund_Amount__c: string;
  };
  contactId: string;
  job_offerings: Array<{ Id: string; Priority__c: number }>;
  documents: DocumentResponse[];
  success: boolean;
}

export interface OnwardSaveSectionResponse {
  type: 'ONWARD';
  application: {
    Allow_Payment__c: boolean;
    Application_Trip_Offering_Name__c: string;
    Application_Trip_Offering__c: string;
    EX_Move_to_Registration_Phase_II__c: boolean;
    FSS_Phase_2__c: boolean;
    Final_Eligibility__c: 'TBD' | 'Eligible' | 'Ineligible';
    Id: string;
    Is_Trip_Change_Allowed__c: boolean;
    Phase_1_Allow_Submission__c: boolean;
    Phase_1_Complete__c: string;
    Phase_2_Complete__c: string;
    Phase_2_Submission_Date__c: string;
    Website_Change_Trip_Required__c: boolean;
    'ED_College_University_Name__r.Taglitom_Campus_ID__c': string;
    First_Priority_With_Whom_Want_to_Go__c: string;
    ED_Are_you_currently_a_student__c: string;
    Allow_Alumni_Registration__c: boolean;
    Gender__c: string;
  };
  contactId: string;
  documents: DocumentResponse[];
  israel_passport: null;
  job_offerings: [];
  parents: FormIds;
  allergies: FormIds;
  medications: FormIds;
  passport: null;
  references: [];
  success: boolean;
}

type FormIds = Array<{ Id: string; Form_Id__c: string }>;

export interface DocumentResponse {
  formId: string;
  id: string;
}
