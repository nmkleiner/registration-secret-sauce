import FormElementsManager from '../../Managers/form-elements-manager';
import { RemovableRef } from '@vueuse/shared';
import { ParentSectionManager } from '../../../../excel-registration-front/src/Modules/Onward/Manager/parent-section.manager';
import { DataForAlgorithmPrograms } from '../../Interfaces/application-data.interfaces';

export interface ApplicationState {
  formId: string;
  formName: string;
  resourceId: number;
  applicationId: RemovableRef<string>; // the application that is currently in view/edit
  throwError: boolean;
  formElementsManager: FormElementsManager;
  parentSectionManager: ParentSectionManager;
  activationStatus: string;
  hasApplicationBeenSubmitted: boolean;
  isPhase2Application: boolean;
  isPhase2Submission: boolean;
  activePhase: number; // 1 / 2 - from url param
  maxFileSize: number; // MB
  phase1: {
    allowSubmission: boolean;
    completed: boolean;
  };
  phase2: {
    allowSubmission: boolean;
    completed: boolean;
  };
  hasIneligibleError: boolean;
  currentApplicationId: string;
  dataForAlgorithmPrograms: DataForAlgorithmPrograms;
  isAllowChangeOnwardTrip: boolean;
}
