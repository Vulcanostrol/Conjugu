import AuthButton from "@/components/AuthButton";

export default function Header() {
  return (
    <header className="relative bg-transparent">
      <nav className="container max-w-5xl flex items-center justify-between px-8 py-4 mx-auto">
        <AuthButton/>
      </nav>
    </header>
  );
}
