'use client';

import {KeyboardEvent, useRef, useState} from "react";
import {FlashCardType} from "@/typing/types";

export function FlashCard({prompt, answer: answerString}: FlashCardType) {

  // const [];
  const inputElement = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const allAnswers = answerString.split(",").map((answer) => answer.trim());

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key !== "Enter") return
    handleSubmit();
  };

  return (
    <div className="text-center border border-base-content card w-96 h-48 bg-neutral-900">
      <div className="card-body">
        <p className="text-4xl">{prompt}</p>
        <label className={`input input-bordered flex items-center gap-2 ${submitted ? '!hidden' : ''}`}>
          <input type="text"
                 className="grow text-center"
                 placeholder="type your answer..."
                 ref={inputElement}
                 onKeyDown={handleKeyPress}
          />
        </label>
        {submitted && <>
          <p
            className={inputElement.current && allAnswers.includes(inputElement.current.value) ? 'text-success' : 'text-error'}>
            {inputElement.current?.value}
          </p>
          <p>
            {answerString}
          </p>
        </>}
      </div>
    </div>
  );
}
