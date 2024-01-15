export interface QuestionOption {
  id?: string;
  name: string;
  sort: number;
  resourceId?: number;
  mapping: AnswerMapping;
}

export interface AnswerMapping {
  answerName: string;
}
