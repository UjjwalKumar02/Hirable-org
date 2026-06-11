export interface Form {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage?: string;

  isPublished: boolean;
  publishedLink?: string;
  responseLimit?: number;

  formFields: FormField[];

  createdAt: Date;
  updatedAt: Date;
}

export type FormFieldType =
  | "TEXT"
  | "LONG_TEXT"
  | "NUMBER"
  | "EMAIL"
  | "DROPDOWN";

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  wordLimit?: number;
  order: number;
  options: string[];
}
