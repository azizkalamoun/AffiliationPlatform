import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Affiliation Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.className}`}>
        <main className="min-h-screen flex">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
