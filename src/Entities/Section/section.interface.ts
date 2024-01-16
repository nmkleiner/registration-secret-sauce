import { BasicInput } from '../FormElements';

export interface BaseSectionInterface {
  name: string;
  columns: number;
}

export interface SectionInterface extends BaseSectionInterface {
  inputs: BasicInput[];
  saveButtonText: string;
  save(values: unknown): Promise<void>;
  calculateSaveButtonText(): string;
}
