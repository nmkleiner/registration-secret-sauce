import { StateOption } from '../../Entities/Options/state-option';
import { CountryOption } from '../../Entities/Options/country-option';
import { UniversityOption } from '../../Entities/Options/university-option';
import { Option } from '../../Entities/Options/option';
import { CheckboxOption } from '../../Entities/Options/checkbox-option';

export interface DropdownOptionsState {
  dbOptions: {
    states: StateOption[];
    countries: CountryOption[];
    universities: UniversityOption[];
    studyAreas: Option[];
    medicalDiagnoses: CheckboxOption[];
  };
}
