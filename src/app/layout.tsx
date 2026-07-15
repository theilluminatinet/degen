import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Degen Central — Live Life Like a KING",
  description:
    "The #1 most trusted and complete list of sweepstakes casinos. Free daily SC, exclusive bonuses, and winning strategies. Live life like a KING.",
  keywords: "sweepstakes casinos, free SC, sweeps coins, casino bonuses, degen central",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-900 text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
