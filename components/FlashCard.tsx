import {useCallback, useMemo, useRef, useState} from "react";
import {SpacedRepetitionCardType} from "@/typing/types";
import {KeyboardEvent} from 'react';
import {createClient} from "@/utils/supabase/client";
import {
  initDifficulty, initInterval,
  initStability,
  nextDifficulty,
  nextForgetStability, nextInterval,
  nextRecallStability,
  nextStatus,
  powerForgetCurve
} from "@/utils/spaced-repetition";

type Props = SpacedRepetitionCardType & {
  removeThisCard: () => void,
};

const MILLISECONDS_IN_DAY = 1000 * 60 * 24;

export function FlashCard({card, stability, difficulty, lapses, status, revision_times, revision_grades, next_review, removeThisCard}: Props) {
  const allAnswers = card.answer.split(",").map((a) => a.trim().toLowerCase());

  const bucket = 1;

  // Hooks.
  const inputElement = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const correctAnswer = useMemo(() => inputElement.current && allAnswers.includes(inputElement.current.value.toLowerCase()), [inputElement.current?.value, allAnswers])

  const submitThisCard = useCallback(() => {
    setSubmitted(true);
    const correct = inputElement.current && allAnswers.includes(inputElement.current.value.toLowerCase());
    const grade = correct ? 4 : 1; // TODO: Properly grading.

    const upsertCardInDatabase = async () => {
      const supabase = createClient();
      const {data: { user }} = await supabase.auth.getUser();
      if (!user) throw new Error('Could not get user when upserting to database.');

      /*
       * Below is all logic related to spaced repetition. The formulas are implemented in spaced-repetition.ts!
       */
      const now = new Date();
      const nowISO = now.toISOString();
      const elapsedMilliseconds = now.getTime() - new Date(next_review).getTime()
      const elapsedDays = elapsedMilliseconds / MILLISECONDS_IN_DAY;

      const firstReview = stability === undefined || difficulty === undefined;
      const recall = firstReview ? 0 : powerForgetCurve(elapsedDays, stability);
      const newStability = firstReview ? initStability(grade) : (grade > 1 ? nextRecallStability(difficulty, stability, recall, grade) : nextForgetStability(difficulty, stability, recall));
      const newDifficulty = firstReview ? initDifficulty(grade) : nextDifficulty(difficulty, grade);

      const isForget = status === "reviewing" && grade === 1
      const newLapses = isForget ? lapses + 1 : lapses;
      const newStatus = nextStatus(status, grade);
      const newIntervalDays = firstReview ? initInterval(newStability, grade) : nextInterval(newStability);
      const newIntervalMilliseconds = newIntervalDays * MILLISECONDS_IN_DAY;

      await supabase.from('sr-entries').upsert({
        user_id: user.id,
        card_id: card.id,
        stability: newStability,
        difficulty: newDifficulty,
        lapses: newLapses,
        status: newStatus,
        revision_times: [...revision_times, nowISO],
        revision_grades: [...revision_grades, grade],
        next_review: new Date(now.getTime() + newIntervalMilliseconds).toISOString(),
      });
    }
    upsertCardInDatabase().catch(console.error);
  }, [card.id, bucket, inputElement, allAnswers]);

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (submitted) {
      removeThisCard();
    } else {
      submitThisCard();
    }
    event.preventDefault();
  }, [card.id, bucket, correctAnswer, submitted, removeThisCard]);

  return (
    <div className="text-center border border-base-content card w-96 h-48 bg-neutral-900">
      <div className="card-body">
        <p className="text-4xl">{card.prompt}</p>
        <label className={`input input-bordered flex items-center gap-2 ${submitted ? 'absolute opacity-0' : ''}`}>
          <input type="text"
                 className="grow text-center"
                 placeholder="type your answer..."
                 onKeyDown={onKeyDown}
                 ref={inputElement}
          />
        </label>
        {submitted && <>
          <p
            className={inputElement.current && correctAnswer ? 'text-success' : 'text-error'}>
            {inputElement.current?.value}
          </p>
          <p>
            {card.answer}
          </p>
        </>}
      </div>
    </div>
  );
}
