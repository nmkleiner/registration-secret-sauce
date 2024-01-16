import { ContactData } from '../../../Interfaces/contact-data.interfaces';
import { ApplicationData } from '../../../Interfaces/application-data.interfaces';
import { DropdownsFromDB } from '../../../Interfaces/dropdowns-from-db.interface';
import { JobOfferingResponse } from '../../../../../excel-registration-front/src/Modules/Excel/Interfaces/Internship/job-offering-response';
import { BaseFormDataResponse } from './get-form-data-base.interface';

export interface ExcelFormDataResponse extends BaseFormDataResponse {
  type: 'EXCEL';
  contactData: ContactData;
  applicationData: ApplicationData['EXCEL'];
  dropdownsFromDB: DropdownsFromDB['EXCEL'];
  settings: Settings;
  israelPassport: IsraelPassport;
  industries: IndustryResponseInterface[];
  selectedJobOfferings: JobOfferingResponse[];
}

export interface IndustryResponseInterface {
  name: string;
  order: number;
  isActive: boolean;
  resourceId: number;
  jobOfferings: JobOfferingInterface[];
}

export interface JobOfferingInterface {
  id: number;
  countryIsoCode: string;
  industryId: number;
  isActive: boolean;
  description?: string;
  requirements?: string;
  skills?: string;
  order?: number | null;
  seasonCode: number;
  sfIdentifier: string;
  type: string;
  name: string;
}

export interface IsraelPassport {
  id: string;
  documentUrl: string;
  documentType: string;
}

export interface Settings {
  maxFileSize: number; // in bytes
}
