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
  metadataBase: new URL("https://eljefelogistics.com"),
  title: {
    default: "El Jefe Logistics",
    template: "%s | El Jefe Logistics",
  },
  description:
    "El Jefe Logistics provides dependable UK and European road transport, fleet operations, and driver opportunities.",
  applicationName: "JefeCore",
  openGraph: {
    type: "website",
    siteName: "El Jefe Logistics",
    title: "El Jefe Logistics",
    description: "Every Mile Earned. Dependable UK and European road transport.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "El Jefe Logistics",
    description: "Every Mile Earned. Dependable UK and European road transport.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
