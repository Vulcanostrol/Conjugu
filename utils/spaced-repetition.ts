/**
 * Functions and parameters found here:
 *
 */
import {SpacedRepetitionStatusType} from "@/typing/types";

const DECAY = -0.5;
const FACTOR = 0.9 ** (1 / DECAY) - 1;

/*
 * Magic numbers used in functions below.
 */
const PARAMETERS = {
  w: [
    // Used for initializing stability (0,1,2,3).
    0.4, 0.6, 2.4, 5.8,
    // Used for initializing difficulty (4,5).
    4.93, 0.94,
    // Used for calculating new difficulty (6,7).
    0.86, 0.01,
    // Used for calculating new stability for recalling (8,9,10).
    1.49, 0.14, 0.94,
    // Used for calculating new stability for forgetting (11,12,13,14).
    2.18, 0.05, 0.34, 1.26,
    // Hard penalty & easy bonus on correct answer (15,16).
    0.29, 2.61,
  ],
  // Desired recall rate: 90%.
  r: 0.9,
}

type Grade = 1 | 2 | 3 | 4;

const RATINGS = {
  again: 1,
  hard: 2,
  good: 3,
  easy: 4,
}

/**
 * Returns the initial stability for a card.
 * @param grade The grade of the first review.
 */
export const initStability = (grade: Grade): number => {
  return Math.max(PARAMETERS.w[grade - 1], 0.1);
};

/**
 * Returns the initial difficulty for a card.
 * @param grade The grade of the first review.
 */
export const initDifficulty = (grade: Grade): number => {
  return Math.min(Math.max(PARAMETERS.w[4] - PARAMETERS.w[5] * (grade - 3), 1), 10);
};

/**
 * Calculates the initial interval for a card.
 * @param stability The new stability of the card, only used for 'easy' grade.
 * @param grade The grade of the first review.
 */
export const initInterval = (stability: number, grade: Grade): number => {
  switch (grade) {
    case RATINGS.again:
      return minutesToDays(1);
    case RATINGS.hard:
      return minutesToDays(5);
    case RATINGS.good:
      return minutesToDays(10);
    case RATINGS.easy:
      return nextInterval(stability);
    default:
      throw new Error(`Invalid grade given for first review: ${grade}.`);
  }
};

const minutesToDays = (minutes: number): number => {
  return minutes / (60 * 24);
};

/**
 * This function calculates the chance at a given time and stability that a card has been forgotten.
 * @param elapsedDays The amount of days since last review.
 * @param stability The stability of the card.
 */
export const powerForgetCurve = (elapsedDays: number, stability: number): number => {
  return (1 + FACTOR * elapsedDays / stability) ** DECAY
};

/**
 * Calculates the interval to the next review.
 * @param stability The new stability of the card.
 */
export const nextInterval = (stability: number): number => {
  return stability / FACTOR * (PARAMETERS.r ** (1 / DECAY) - 1)
};

/**
 * Calculates the new difficulty of a card. This is purely based on the grades given to the card, not time intervals.
 * @param currentDifficulty The current difficulty of the card.
 * @param grade The grade given in the last review.
 */
export const nextDifficulty = (currentDifficulty: number, grade: Grade): number => {
  const next = currentDifficulty - PARAMETERS.w[6] * (grade - 3);
  return Math.min(Math.max(meanReversion(PARAMETERS.w[4], next), 1), 10);
};

const meanReversion = (init: number, current: number) => {
  return PARAMETERS.w[7] * init + (1 - PARAMETERS.w[7]) * current;
}

/**
 * Calculates the new stability of a card, given a successful recall in the review.
 * @param currentDifficulty The current difficulty value of the card.
 * @param currentStability The current stability value of the card.
 * @param currentRecall The current recall rate of the card.
 * @param grade The grade given in the last review.
 */
export const nextRecallStability = (currentDifficulty: number, currentStability: number, currentRecall: number, grade: Grade): number => {
  const hardPenalty = grade == RATINGS.hard ? PARAMETERS.w[15] : 1
  const easyBonus = grade == RATINGS.easy ? PARAMETERS.w[16] : 1
  return currentStability * (
    1
    + Math.exp(PARAMETERS.w[8])
    * (11 - currentDifficulty)
    * currentStability ** -PARAMETERS.w[9]
    * (Math.exp((1 - currentRecall) * PARAMETERS.w[10]) - 1)
    * hardPenalty
    * easyBonus
  )
};

/**
 * Calculates the new stability of a card, given a failure (forget) in the review.
 * @param currentDifficulty The current difficulty value of the card.
 * @param currentStability The current stability value of the card.
 * @param currentRecall The current recall rate of the card.
 */
export const nextForgetStability = (currentDifficulty: number, currentStability: number, currentRecall: number): number => {
  return (
    PARAMETERS.w[11]
    * currentDifficulty ** -PARAMETERS.w[12]
    * ((currentStability + 1) ** PARAMETERS.w[13] - 1)
    * Math.exp(PARAMETERS.w[14] * (1 - currentRecall))
  )
};

/**
 * Determines the new status of a card.
 * @param currentStatus The current status of the card.
 * @param grade The grade given in the last review.
 */
export const nextStatus = (currentStatus: SpacedRepetitionStatusType, grade: Grade): SpacedRepetitionStatusType => {
  switch (currentStatus) {
    case "new":
      return grade === 4 ? "reviewing" : "learning";
    case "learning":
    case "relearning":
      return grade >= 3 ? "reviewing" : currentStatus;
    case "reviewing":
      return grade >= 2 ? "reviewing" : "relearning";
    default:
      console.error(`Invalid card state: ${currentStatus}`)
      return "new"; // Status is weird, so just act as if the card is new.
  }
}
