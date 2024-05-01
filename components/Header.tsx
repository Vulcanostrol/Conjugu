import AuthButton from "@/components/AuthButton";
import Link from "next/link";

type Props = {
  linkToDecks?: boolean,
}

export default function Header({linkToDecks}: Props) {
  return (
    <header className="relative bg-transparent">
      <nav className="container max-w-5xl flex items-center justify-between px-8 py-4 mx-auto">
        {linkToDecks && <Link
          href="/decks"
          className="justify-start rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
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
        </Link>}
        <AuthButton/>
      </nav>
    </header>
  );
}
