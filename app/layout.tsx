import type { Metadata } from "next";
import "./globals.css";
import "./concept.css";
import "./logo.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://volyaensemble.ee"),
  title: "VOLYA — український ансамбль в Естонії",
  description: "Український ансамбль пісні і танцю VOLYA у Таллінні.",
  openGraph: {
    title: "VOLYA — український ансамбль в Естонії",
    description: "Пісня, танець і українська спільнота у Таллінні.",
    images: ["/og.jpg"],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="uk"><body>{children}</body></html>; }
