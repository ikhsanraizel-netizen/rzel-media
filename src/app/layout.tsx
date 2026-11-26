import "./globals.css";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
const d = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-display" });
const b = Hanken_Grotesk({ subsets: ["latin"], variable: "--f-body" });
export const metadata = { title: "rZel Media", description: "Every Shadow Has a Story." };
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body className={`${d.variable} ${b.variable}`}>{children}</body></html>;
}
