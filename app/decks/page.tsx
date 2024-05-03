import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {DailyStat} from "@/components/DailyStat";

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
      <section className="md:min-h-[100vh] bg-base-100 relative overflow-hidden">
        <div className="relative z-[99999]">
          <Header/>
        </div>
        <div className="animate-in relative z-10 lg:max-w-4xl xl:lg:max-w-7xl mx-auto grid justify-items-center content-center px-8 pt-24">
          <DailyStat/>
        </div>
        <div className="animate-in relative z-10 lg:max-w-4xl xl:lg:max-w-7xl mx-auto grid gap-16 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 justify-items-center content-center px-8 py-24">
          {data.map((deck) => <div className="card w-96 h-48 bg-primary text-primary-content">
            <div className="card-body">
              <h2 className="card-title">{deck.name}</h2>
              <p>{deck.description}</p>
              <div className="card-actions justify-end">
                <a className="btn" href={`/deck/${deck.id}`}>Study</a>
              </div>
            </div>
          </div>)}
        </div>
      </section>
      <Footer/>
    </>
  );
}
