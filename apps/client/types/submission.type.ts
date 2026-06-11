export interface Submission {
  id: string;
  fieldAnswers: FieldAnswer[];
  createdAt: Date;
}

export interface FieldAnswer {
  id?: string;
  value: string;
  formFieldId?: string;
}
