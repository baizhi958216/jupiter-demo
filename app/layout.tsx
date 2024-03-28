import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jupiter",
  description: "Jupiter skill",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
