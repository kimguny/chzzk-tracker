import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
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
  title: "치지직 팔로우 분석기",
  description: "치지직 팔로워/팔로잉 현황 분석 및 맞팔 취소 감지 서비스",
  other: {
    "google-adsense-account": "ca-pub-7999168388112475",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col" style={{ background: "#0a0a0a" }}>
        <header style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a" }}>
          <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-sm font-bold" style={{ color: "#fff" }}>
              치지직 <span style={{ color: "#00FFA3" }}>팔로우 분석기</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/faq" className="text-sm" style={{ color: "#888" }}>FAQ</Link>
              <Link href="/privacy" className="text-sm" style={{ color: "#888" }}>개인정보처리방침</Link>
              <a
                href="https://github.com/kimguny/chzzk-tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm"
                style={{ color: "#00FFA3" }}
              >
                GitHub
              </a>
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <footer className="py-6" style={{ borderTop: "1px solid #1a1a1a" }}>
          <div className="mx-auto max-w-4xl px-4 flex gap-4 text-xs" style={{ color: "#444" }}>
            <Link href="/faq" style={{ color: "#444" }}>FAQ</Link>
            <Link href="/privacy" style={{ color: "#444" }}>개인정보처리방침</Link>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
