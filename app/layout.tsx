import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Superfox.net - Learn, Play, and Grow!",
  description: "Interactive educational platform for kids with Superfox - your friendly learning companion!",
  keywords: ["education", "kids", "learning", "games", "stories", "superfox"],
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦊</text></svg>',
        type: 'image/svg+xml',
      }
    ],
  },
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
