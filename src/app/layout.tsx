import type { Metadata } from "next";
import "./globals.css";
import { getSettings } from "@/lib/getSettings";

/** Metadata is dynamic so the favicon follows the uploaded brand mark. Prefer
 *  the square favicon tile (legible on light tabs); fall back to the signature. */
export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getSettings();
  const icon = brand.favicon || brand.signature;
  return {
    title:
      "ABM Whaiduzzaman — builds technology · trains entrepreneurs · creates brands",
    description:
      "The official site of ABM Whaiduzzaman: technologist, entrepreneur educator (One-Focus), and brand builder.",
    icons: icon ? { icon } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
