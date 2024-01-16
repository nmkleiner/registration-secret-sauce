import { FileInput } from "../file-input";
import { BasicInput } from "../index";

export function isFileInput(input: BasicInput): input is FileInput {
  return input instanceof FileInput;
}
