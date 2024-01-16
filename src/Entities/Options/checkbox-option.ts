import { Option } from "./option";
import { QuestionOption } from "registration-secret-sauce";

export class CheckboxOption extends Option {
  constructor(rawOption: QuestionOption) {
    super(rawOption);
  }
}
