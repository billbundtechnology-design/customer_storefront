import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rentos Events — Make room for the moments",
  description: "Discover event rentals, intimate venues and event planning in Lagos."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
