import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Balaji Mills | Premium Yellow Mustard Oil | Peele Sarso Ka Tel",
  description: "Experience absolute purity and traditional craftsmanship with Balaji Mills Maharajan, the premium cold-pressed yellow mustard oil (Peele Sarso Ka Tel).",
  keywords: ["Balaji Mills", "Mustard oil", "Peele sarso", "Sarso ka tel", "Yellow mustard oil", "Cold pressed mustard oil", "Kachi ghani", "Maharajan"],
  openGraph: {
    title: "Balaji Mills | Premium Yellow Mustard Oil",
    description: "Experience absolute purity and traditional craftsmanship with Balaji Mills Maharajan, the premium cold-pressed yellow mustard oil.",
    type: "website",
    locale: "en_IN",
    siteName: "Balaji Mills"
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
