import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyNews | Latest World, Technology, Business & Health News",
  description: "Stay updated with the latest news from around the world. Explore top stories, technology updates, business trends, health news, and more on MyNews.",
  keywords: [
    "news",
    "world news",
    "technology news",
    "business news",
    "health news",
    "latest news",
    "top stories"
  ],
  authors: [{ name: "MyNews Team", url: "https://portfoliomanish.vercel.app/" }],
  viewport: "width=device-width, initial-scale=1.0",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
