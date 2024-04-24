'use client';

import {KeyboardEvent, useEffect, useState} from "react";
import {FlashCard} from "@/components/FlashCard";
import {FlashCardType} from "@/typing/types";
import {createClient} from "@/utils/supabase/client";

export function FlashCardStack() {
  const [cards, setCards] = useState<Array<FlashCardType>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const {data} = await supabase.from('cards').select();
      if (!data) return;
      setCards(data);
    }
    fetchData().catch(console.error);
  }, [])

  const handleEnterPress = () => {
    const topCard = cards[0];
    if (!topCard) return;
    setCards(cards.slice(1, cards.length + 1));

    const upsertCardInDatabase = async () => {
      const supabase = createClient();
      const {data: { user }} = await supabase.auth.getUser();
      await supabase.from('sr-entries').upsert({
        user_id: user?.id,
        card_id: topCard.id,
        bucket: 3,
        last_seen: new Date().toISOString(),
      });
      console.log('Done upserting (?)');
    }
    upsertCardInDatabase().catch(console.error);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key !== "Enter") return;
      handleEnterPress();
    };
    // @ts-ignore
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      // @ts-ignore
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [cards]);

  return (
    <div className="stack">
      {cards && cards.map((card) => <FlashCard key={card.id} id={card.id} prompt={card.prompt} answer={card.answer}/>)}
    </div>
  );
}
