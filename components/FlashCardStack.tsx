'use client';

import {useCallback, useEffect, useState} from "react";
import {FlashCard} from "@/components/FlashCard";
import {FlashCardType} from "@/typing/types";
import {createClient} from "@/utils/supabase/client";

type Props = {
  deckId: number,
}

type CardWithBucketData = FlashCardType & {
  bucket: number | undefined,
}

export function FlashCardStack({ deckId }: Props) {
  const [cards, setCards] = useState<Array<CardWithBucketData>>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Get user data.
      const supabase = createClient();
      const {data: { user }} = await supabase.auth.getUser();
      if (!user) throw new Error('User could not be retrieved.');

      // Get all cards in the current deck.
      const {data: cardDeckData} = await supabase.from('card-deck').select().eq('deck', deckId);
      if (!cardDeckData) throw new Error('Deck\'s cards could not be retrieved.');
      const cardIds = cardDeckData.map((entry) => entry.id);

      // Get all the data for all the retrieved cards.
      const {data: cardsData} = await supabase.from('cards').select().in('id', cardIds);
      if (!cardsData) throw new Error('Card data could not be retrieved.');

      // Get spaced repetition data.
      const {data: spacedRepetitionData} = await supabase.from('sr-entries').select().eq('user_id', user.id);
      if (!spacedRepetitionData) throw new Error('Spaced repetition data could not be retrieved.');

      // Combine card with their buckets.
      const cardWithBucketData = cardsData.map((card: FlashCardType) => ({
        ...card,
        bucket: spacedRepetitionData.find((spacedRepetitionObject) => spacedRepetitionObject.card_id === card.id)?.bucket,
      }));
      setCards(cardWithBucketData);
    }
    fetchData().catch(console.error);
  }, []);

  const removeTopCard = useCallback(() => {
    setCards(cards.slice(1, cards.length + 1));
  }, [cards, setCards]);

  return (
    <>
      <div className="stack">
        {cards && cards.map((card) => <FlashCard
          key={card.id}
          id={card.id}
          prompt={card.prompt}
          answer={card.answer}
          bucket={card.bucket}
          removeThisCard={removeTopCard}
        />)}
      </div>
      {cards.length > 0 && <button className="btn btn-primary" onClick={removeTopCard}>
        Next card
      </button>}
    </>
  );
}
