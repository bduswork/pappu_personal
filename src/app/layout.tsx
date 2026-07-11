import type { Metadata } from "next";
import "./globals.css";
import { getSettings } from "@/lib/getSettings";

/** Metadata is dynamic so the favicon follows the uploaded brand signature. */
export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getSettings();
  return {
    title:
      "ABM Whaiduzzaman — builds technology · trains entrepreneurs · creates brands",
    description:
      "The official site of ABM Whaiduzzaman: technologist, entrepreneur educator (One-Focus), and brand builder.",
    icons: brand.signature ? { icon: brand.signature } : undefined,
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
