import { RegistrationTab } from '../../Entities/Tab/registration-tab';
import { LocationQuery } from 'vue-router';

export interface FormNavigationState {
  EXCEL: {
    phase1Tabs: RegistrationTab[];
    phase2Tabs: RegistrationTab[];
  };
  ONWARD: {
    tabs: RegistrationTab[];
  };
  queryParams: LocationQuery;
  fullLoginUrl: string;
}
