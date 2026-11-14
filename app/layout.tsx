import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FocusFlow — Make time for what matters",
  description: "Plan your day, protect your focus, and build better habits with FocusFlow."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}