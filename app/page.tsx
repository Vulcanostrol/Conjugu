import {createClient} from "@/utils/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function FeatureCheckMark() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]className-primary">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
  </svg>;
}

export default async function Index() {
  const supabase = createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  return (
    <>
      <section className="md:min-h-[100vh] bg-base-100 relative overflow-hidden">
        <div className="relative z-[99999]">
          <Header/>
        </div>
        <div className="animate-in relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center gap-16 px-8 py-24 text-center">
          <div className="space-y-2">
            {/*Enable these lines when Stripe is integrated (maybe, maybe just keep it free).*/}
            {/*<div className="flex justify-center items-center text-xs text-base-content">*/}
            {/*  Powered by*/}
            {/*  <Image src={stripeLogo}*/}
            {/*         alt="Stripe - Payments infrastructure for the internet."*/}
            {/*         className="inline w-12"*/}
            {/*  />*/}
            {/*</div>*/}
            <h1 className="font-extrabold text-4xl lg:text-6xl tracking-normal">
              Master Spanish conjugation
              <br/>
              from scratch!
            </h1>
          </div>
          <p className="text-lg text-baseclassNameent-secondary leading-relaxed max-w-md mx-auto">
            Learn the fundamentals of Spanish faster, easier, and better!
          </p>
          <ul className="hidden md:block tclassNamease-content-secondary leading-relaxed space-y-1">
            <li className="flex items-centerclassNameify-center lg:justify-start gap-2">
              <FeatureCheckMark/>
              Step-by-step lessons
            </li>
            <li className="flex items-centerclassNameify-center lg:justify-start gap-2">
              <FeatureCheckMark/>
              Spaced repetition rehearsals
            </li>
            <li className="flex items-centerclassNameify-center lg:justify-start gap-2">
              <FeatureCheckMark/>
              Progress tracking
            </li>
          </ul>
          {user ? <>
            <a className="btn btn-primary btn-wide group" href="/decks">
              Continue your journey
            </a>
          </> : <>
            <a className="btn btn-primary btn-wide group" href="/login">
              Start learning
            </a>
          </>}
        </div>
      </section>
      <Footer/>
    </>
  );
}
