import { Gabarito } from "next/font/google";
import "./globals.css";
import React from "react";

const gabarito = Gabarito({
  weight: '400',
  subsets: ['latin'],
})

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Conjugu - Learn Spanish from scratch",
  description: "Learn Spanish from scratch!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={gabarito.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
