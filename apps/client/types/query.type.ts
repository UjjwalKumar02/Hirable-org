export type Query = {
  question: string;
  createdAt: Date;
};

export type LLMResponse = {
  submissionId: string;
  document: string;
  reasoning: string;
}[];

export type Source = {
  submissionId: string;
  document: string;
  distance: number;
};

export interface Chat {
  query: Query;
  llmResponse: LLMResponse;
  sources: Source[];
}
