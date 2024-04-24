import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4 flex-1 justify-end">
      Hey, {user.email}!
      <form action={signOut}>
        <button className="btn btn-neutral">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <div className="flex items-center gap-4 flex-1 justify-end">
      <Link
        href="/login"
        className="btn btn-neutral"
      >
        Login
      </Link>
    </div>
  );
}
