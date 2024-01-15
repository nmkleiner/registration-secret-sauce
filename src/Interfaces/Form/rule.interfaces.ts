export interface QuestionRule {
  rule: Rule;
  value: string;
}

export interface RuleMessage {
  id: number;
  rule: Rule;
  message: string;
}

export interface Rule {
  programmaticName: string;
}
