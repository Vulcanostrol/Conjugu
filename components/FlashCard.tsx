import {useCallback, useMemo, useRef, useState} from "react";
import {FlashCardType} from "@/typing/types";
import {KeyboardEvent} from 'react';
import {createClient} from "@/utils/supabase/client";

type Props = FlashCardType & {
  bucket: number | undefined,
  removeThisCard: () => void,
};

export function FlashCard({id, prompt, answer, bucket, removeThisCard}: Props) {
  const allAnswers = answer.split(",").map((a) => a.trim().toLowerCase());

  // Hooks.
  const inputElement = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const correctAnswer = useMemo(() => inputElement.current && allAnswers.includes(inputElement.current.value.toLowerCase()), [inputElement.current?.value, allAnswers])

  const submitThisCard = useCallback(() => {
    setSubmitted(true);
    const correct = inputElement.current && allAnswers.includes(inputElement.current.value.trim().toLowerCase());

    const newBucket = correct ? (bucket ? Math.min(bucket + 1, 5) : 3) : 1;
    const upsertCardInDatabase = async () => {
      const supabase = createClient();
      const {data: { user }} = await supabase.auth.getUser();
      await supabase.from('sr-entries').upsert({
        user_id: user?.id,
        card_id: id,
        bucket: newBucket,
        last_seen: new Date().toISOString(),
      });
      console.log(`Upserted card (${bucket} -> ${newBucket})`);
    }
    upsertCardInDatabase().catch(console.error);
  }, [id, bucket, inputElement, allAnswers]);

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (submitted) {
      removeThisCard();
    } else {
      submitThisCard();
    }
    event.preventDefault();
  }, [id, bucket, correctAnswer, submitted, removeThisCard]);

  return (
    <div className="text-center border border-base-content card w-96 h-48 bg-neutral-900">
      <div className="card-body">
        <p className="text-4xl">{prompt}</p>
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
            {answer}
          </p>
        </>}
      </div>
    </div>
  );
}
