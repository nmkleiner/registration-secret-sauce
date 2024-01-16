import { Program } from 'registration-secret-sauce';
import { RemovableRef } from '@vueuse/shared';

export interface ProgramState {
  programs: Program[];
  programsPulled: boolean;
  fellowshipSelectedPrograms: Program[];
  remoteWorkSelectedPrograms: Program[];
  volunteeringSelectedPrograms: Program[];
  isProgramSaved: boolean;
  applicationPrograms: Program[];
  notRelevantApplicationPrograms: Program[];
  // when selecting program from url param, the program cannot be changed
  urlParams: {
    program: RemovableRef<string>;
    organizerId: RemovableRef<string>;
    partnerId: RemovableRef<string>;
  };
  selectedProgramFromUrlParam: boolean;
}
