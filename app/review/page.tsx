import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {ReviewStack} from "@/components/ReviewStack";

export default async function DecksPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const {data} = await supabase.from('decks').select().order('ordering');
  if (!data) throw new Error('Decks could not be retrieved.');

  return (
    <>
      <section className="relative md:relative grow overflow-hidden">
        <div className="relative z-[99999]">
          <Header linkToDecks={true}/>
        </div>
        <div className="animate-in absolute top-0 z-10 w-full h-full flex items-center justify-center">
          <ReviewStack/>
        </div>
      </section>
      <Footer/>
    </>
  );
}
