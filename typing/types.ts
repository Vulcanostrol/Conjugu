export type FlashCardType = {
  id: number
  prompt: string,
  answer: string,
};

export type SpacedRepetitionStatusType = 'new' | 'learning' | 'reviewing' | 'relearning'

export type SpacedRepetitionCardType = {
  card: FlashCardType,
  user_id: string,
  status: SpacedRepetitionStatusType,
  stability: number,
  difficulty: number,
  lapses: number,
  revision_times: Array<string>,
  revision_grades: Array<number>,
  next_review: string,
};