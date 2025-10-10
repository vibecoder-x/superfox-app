import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Superfox.net - Learn, Play, and Grow!",
  description: "Interactive educational platform for kids with Superfox - your friendly learning companion!",
  keywords: ["education", "kids", "learning", "games", "stories", "superfox"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
