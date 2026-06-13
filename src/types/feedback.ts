export interface FeedbackState {
  /** User submitted an answer (check button or option select) */
  isChecked: boolean;
  /** `true` = match, `false` = mistake, `null` = not yet checked */
  isCorrect: boolean | null;
  /** Correct key to display on mistakes (word or full sentence) */
  correctAnswerText: string;
}

export const INITIAL_FEEDBACK: FeedbackState = {
  isChecked: false,
  isCorrect: null,
  correctAnswerText: "",
};

export function createFeedback(
  isCorrect: boolean,
  correctAnswerText: string
): FeedbackState {
  return {
    isChecked: true,
    isCorrect,
    correctAnswerText,
  };
}
