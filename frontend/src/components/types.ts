export interface SentenceEntity {
  sentenceId: string;
  codeSwitchedSentence: string;
  reference: string;
  audioUrl: string | null;
  isCodeSwitched: boolean;
  isAccurateTranslation: boolean;
  fluency: number;
}
