import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {FlashCardStack} from "@/components/FlashCardStack";
import Link from "next/link";

type Props = {
  params: {
    id: number
  },
};

export default async function DeckPracticePage({params}: Props) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <>
      <section className="relative md:relative grow overflow-hidden">
        <div className="relative z-[99999]">
          <Header linkToDecks={true}/>
        </div>
        <div className="animate-in absolute top-0 z-10 w-full h-full flex items-center justify-center">
          <FlashCardStack deckId={params.id} />
        </div>
      </section>
      <Footer/>
    </>
  );
}
