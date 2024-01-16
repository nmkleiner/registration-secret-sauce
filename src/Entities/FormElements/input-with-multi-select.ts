import { RawQuestion } from "registration-secret-sauce";
import { CheckboxOption } from "../Options/checkbox-option";
import { UserInput } from "registration-secret-sauce";
import { BaseSectionInterface } from "../Section/section.interface";
import { InputWithOptions } from "./index";
import { OptionTransformer } from "../../Transformers/option.transformer";
import { isEmpty } from "lodash-es";
import { Option } from "../Options/option";

export class InputWithMultiSelect extends InputWithOptions {
  public declare options: CheckboxOption[];
  public selectedOptionValues: Set<string> = new Set();

  constructor(rawQuestion: RawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);

    this.initializeSelectedOptions();
  }

  public buildOptions(rawQuestion: RawQuestion): CheckboxOption[] {
    return OptionTransformer.transformCheckboxOptions(
      rawQuestion.options,
      rawQuestion.name
    );
  }

  public isSelected(optionValue: string): boolean {
    return this.selectedOptionValues.has(optionValue);
  }

  public getValueForAnswer(): UserInput {
    return Array.from(this.selectedOptionValues).join(";");
  }

  public updateSelectedOptions(optionValue: string): void {
    if (this.isSelected(optionValue)) {
      this.selectedOptionValues.delete(optionValue);
    } else {
      this.selectedOptionValues.add(optionValue);
    }
    this.value = Array.from(this.selectedOptionValues).join(";");
  }

  public clearSelectedOptions(): void {
    this.selectedOptionValues.clear();
    this.value = "";
  }

  protected initializeSelectedOptions() {
    if (!isEmpty(this.value)) {
      this.value.split(";").forEach((optionValue) => {
        this.selectedOptionValues.add(optionValue);
      });
    }
  }

  optionSelected(selectedOption: Option): void {
    super.optionSelected(selectedOption);
    this.handleNoneOption(selectedOption, false);
  }

  optionDeselected(selectedOption: Option): void {
    super.optionDeselected(selectedOption);
    this.handleNoneOption(selectedOption, true);
  }

  handleNoneOption(option: Option, show: boolean): void {
    if (option.value.toLowerCase() === "none") {
      const otherOptions = this.options.filter(
        (option) => option.value.toLowerCase() !== "none"
      );

      otherOptions.forEach((option) => (show ? option.show() : option.hide()));
      if (!show) {
        this.selectedOptionValues.clear();
      }
    }
  }
}
