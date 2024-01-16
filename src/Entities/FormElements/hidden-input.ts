import { BasicInput } from "./index";

export class HiddenInput extends BasicInput {
  public isVisible: boolean = false;

  public show() {
    return this;
  }
}
