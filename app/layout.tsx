import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HSEvents — Make room for the moments",
  description: "Explore event rentals, venues and planning from HSEvents in Lagos, Nigeria.",
  openGraph: {
    title: "HSEvents — Event rentals, venues & planning",
    description: "Bring your Lagos celebration together with event rentals, venues and planning support.",
    locale: "en_NG",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
