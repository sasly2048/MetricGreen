import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { CommandMenu } from "../components/CommandMenu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MetricGreen - Decentralized Carbon Credit Infrastructure",
  description: "Decentralized Carbon Credit Infrastructure",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster theme="dark" position="bottom-right" richColors />
        <CommandMenu />
        {children}
      </body>
    </html>
  );
}
