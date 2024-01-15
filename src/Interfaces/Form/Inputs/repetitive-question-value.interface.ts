export interface RepetitiveQuestionValue {
  radioButtonValue: string;
  duplicatedValues: Record<string, string>[];
}

export function isRepetitiveQuestionValue(obj: any | null): obj is RepetitiveQuestionValue {
  return obj && obj.radioButtonValue;
}
