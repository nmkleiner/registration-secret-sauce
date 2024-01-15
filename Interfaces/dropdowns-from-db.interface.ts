import { RawStateOption } from './raw-state-option.interface';
import { RawCountryOption } from './raw-country-option.interface';
import { RawUniversityOption } from './raw-university-option.interface';
import { RawDropdownFromDBOption } from './raw-dropdown-from-db-option.interface';

export interface DropdownsFromDB {
  EXCEL: {
    states: RawStateOption[];
    countries: RawCountryOption[];
    universities: RawUniversityOption[];
  };
  ONWARD: {
    states: RawStateOption[];
    countries: RawCountryOption[];
    universities: RawUniversityOption[];
    studyAreas: RawDropdownFromDBOption[];
    medicalDiagnoses: RawDropdownFromDBOption[];
  };
}
