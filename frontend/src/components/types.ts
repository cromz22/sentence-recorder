export interface SentenceType {
  sentence_id: number;
  sentence: string;
}

export interface TaskType {
  task_id: string;
  sentences: SentenceType[];
}
