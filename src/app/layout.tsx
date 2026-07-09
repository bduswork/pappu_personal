import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen bg-white antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
