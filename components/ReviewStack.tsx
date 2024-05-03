'use client';

import {useCallback, useEffect, useState} from "react";
import {FlashCard} from "@/components/FlashCard";
import {FlashCardType, SpacedRepetitionCardType} from "@/typing/types";
import {createClient} from "@/utils/supabase/client";

export function ReviewStack() {
  const [spacedRepetitionCards, setSpacedRepetitionCards] = useState<Array<SpacedRepetitionCardType> | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      // Get user data.
      const supabase = createClient();
      const {data: { user }} = await supabase.auth.getUser();
      if (!user) throw new Error('User could not be retrieved.');

      // Get spaced repetition data.
      const {data: spacedRepetitionData} = await supabase.from('sr-entries')
        .select()
        .eq('user_id', user.id)
        .lte('next_review', new Date().toISOString());
      if (!spacedRepetitionData) throw new Error('Spaced repetition data could not be retrieved.');
      const cardIds = spacedRepetitionData.map((entry) => entry.card_id);

      // Get all the data for all the retrieved cards.
      const {data: cardsData} = await supabase.from('cards').select().in('id', cardIds);
      if (!cardsData) throw new Error('Card data could not be retrieved.');

      // Combine card with their buckets.
      const spacedRepetitionCards: Array<SpacedRepetitionCardType> = cardsData.map((card: FlashCardType) => {
        const spacedRepetitionForCard = spacedRepetitionData.find((item) => item.card_id === card.id);
        if (spacedRepetitionForCard) {
          return {
            card,
            ...spacedRepetitionForCard,
          };
        }
        throw new Error('No spaced-repetition data for card in review --> should never happen!');
      });

      const now = new Date();
      const filteredAndSorted = spacedRepetitionCards.filter((card) => {
        return new Date(card.next_review).getTime() <= now.getTime();
      }).sort((a, b) => {
        if (new Date(a.next_review).getTime() > new Date(b.next_review).getTime()) {
          return 1;
        } else {
          return -1;
        }
      });

      setSpacedRepetitionCards(filteredAndSorted);
    }
    fetchData().catch(console.error);
  }, []);

  const removeTopCard = useCallback(() => {
    if (!spacedRepetitionCards) return;
    setSpacedRepetitionCards(spacedRepetitionCards.slice(1, spacedRepetitionCards.length + 1));
  }, [spacedRepetitionCards, setSpacedRepetitionCards]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-8 py-24 text-center">
      {spacedRepetitionCards && <>
        <div className="stack">
          {spacedRepetitionCards && spacedRepetitionCards.map((src, index) => <FlashCard
            key={src.user_id + src.card.id}
            card={src.card}
            user_id={src.user_id}
            status={src.status}
            stability={src.stability}
            difficulty={src.difficulty}
            lapses={src.lapses}
            revision_times={src.revision_times}
            revision_grades={src.revision_grades}
            next_review={src.next_review}
            isFirst={index === 0}
            removeThisCard={removeTopCard}
          />)}
        </div>
        {spacedRepetitionCards.length > 0 && <button className="btn btn-primary" onClick={removeTopCard}>
          Next card
        </button>}
        {spacedRepetitionCards.length === 0 && <>
          <p>You finished this deck! Come back later to practice the cards.</p>
          <a className="btn btn-primary" href="/decks">Back to decks</a>
        </>}
      </>}
      {!spacedRepetitionCards && <>
        <div className="skeleton w-96 h-48"></div>
        <div className="skeleton btn w-24 h-8"></div>
      </>}
    </div>
  );
}
