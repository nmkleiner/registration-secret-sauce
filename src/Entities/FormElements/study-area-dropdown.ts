import { Option } from "../Options/option";
import { RawQuestion } from "registration-secret-sauce";
import { UniversityOption } from "../Options/university-option";
import { BaseSectionInterface } from "../Section/section.interface";
import { InputWithOptions } from "./index";
import { OptionTransformer } from "../../Transformers/option.transformer";
import { useDropdownOptionsStore } from "../../../../../../registration-secret-sauce/src/Stores/Stores/DropdownOptions/dropdown-options.store";

export class StudyAreaDropdown extends InputWithOptions {
  declare options: UniversityOption[];

  constructor(rawQuestion: RawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);
  }

  buildOptions(rawQuestion: RawQuestion): Option[] {
    const questionOptions =
      OptionTransformer.transformQuestionOptions(rawQuestion);

    return [
      ...questionOptions,
      ...useDropdownOptionsStore().dbOptions.studyAreas,
    ];
  }
}
