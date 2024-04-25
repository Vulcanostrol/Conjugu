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
      <section className="md:min-h-[100vh] bg-base-100 relative overflow-hidden">
        <div className="relative z-[99999]">
          <Header/>
          <Link
            href="/decks"
            className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>{" "}
            Back
          </Link>
        </div>
        <div className="animate-in relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center gap-16 px-8 py-24 text-center">
          <FlashCardStack deckId={params.id} />
        </div>
      </section>
      <Footer/>
    </>
  );
}
