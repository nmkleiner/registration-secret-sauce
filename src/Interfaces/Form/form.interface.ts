import { RawFormSection } from './section.interfaces';

export interface RawForm {
  id: string;
  name: string;
  resourceId: number;
  sections: RawFormSection[];
}
