import { RemovableRef } from '@vueuse/shared';
import { ApplicationItem } from '../../../../excel-registration-front/src/Modules/Excel/Interfaces/Profile/application-item.interface';
import {
  ContactInformation,
  UserDocument,
  UserPhase2Document,
} from '../../Interfaces/contact-data.interfaces';
import ReturningApplicantsForm from '../../../../excel-registration-front/src/Modules/Onward/Creators/ReturningApplicantForm/ReturningApplicantsForm';

export interface UserState {
  ids: {
    contactId: RemovableRef<string>;
    activeApplicationId: string; // from user - salesforce login response
  };
  isAuthenticated: boolean;
  profileLocalFile: FormData;
  contactDocuments: UserDocument[];
  phase2Documents: UserPhase2Document[];
  applicationsList: ApplicationItem[];
  contactInformation: Omit<ContactInformation, 'id'>;
  returningApplicantForm: typeof ReturningApplicantsForm;

  registrationAgeRange: {
    min: number;
    max: number;
    criticalAge: number;
  };
}
