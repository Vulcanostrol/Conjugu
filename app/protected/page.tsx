import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {FlashCardStack} from "@/components/FlashCardStack";

export default async function ProtectedPage() {
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
        </div>
        <div className="animate-in relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center gap-16 px-8 py-24 text-center">
          <FlashCardStack/>
        </div>
      </section>
      <Footer/>
    </>
  );
}
