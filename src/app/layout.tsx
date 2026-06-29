import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "ABM Whaiduzzaman — builds technology · trains entrepreneurs · creates brands",
  description:
    "The official site of ABM Whaiduzzaman: technologist, entrepreneur educator (One-Focus), and brand builder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        <Sidebar />
        {/* Offset content for the fixed sidebar (desktop) and mobile top bar */}
        <main className="lg:pl-[var(--sidebar-width)]">
          <div className="pt-16 lg:pt-0">{children}</div>
        </main>
      </body>
    </html>
  );
}
