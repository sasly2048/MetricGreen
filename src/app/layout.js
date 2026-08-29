import { Inter, JetBrains_Mono, Space_Grotesk, Instrument_Serif } from "next/font/google";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CommandMenu } from "@/components/site/CommandMenu";
import { AmbientBackground } from "@/components/site/AmbientBackground";
import { DemoStateProvider } from "@/lib/demo-state";
import { VerificationPoller } from "@/components/site/VerificationPoller";
import { AudioBootstrap } from "@/components/site/AudioBootstrap";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata = {
  metadataBase: new URL("https://metricgreen.xyz"),
  title: {
    default: "MetricGreen — Programmable Carbon Credit Infrastructure",
    template: "%s · MetricGreen",
  },
  description:
    "MetricGreen is the institutional-grade decentralized protocol for issuing, trading, and permanently retiring verifiable carbon credits. Powered by zero-knowledge proofs, IoT sensor fusion, and on-chain attestations.",
  keywords: [
    "carbon credits",
    "blockchain",
    "VCM",
    "voluntary carbon market",
    "zero-knowledge",
    "zk-SNARK",
    "Verra",
    "Gold Standard",
    "dMRV",
    "climate tech",
    "Web3",
  ],
  authors: [{ name: "MetricGreen Labs" }],
  creator: "MetricGreen Labs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://metricgreen.xyz",
    title: "MetricGreen — Programmable Carbon Credit Infrastructure",
    description:
      "Mint, trade, and retire verified carbon credits on a decentralized ledger. Eliminate greenwashing with ZK proofs and IoT sensor fusion.",
    siteName: "MetricGreen",
  },
  twitter: {
    card: "summary_large_image",
    title: "MetricGreen — Programmable Carbon Credit Infrastructure",
    description:
      "Institutional-grade decentralized carbon credit protocol. ZK-verified, IoT-anchored, permanently retired.",
    creator: "@metricgreen",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#03060f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable} ${display.variable} ${serif.variable}`}
    >
      <body className="min-h-screen antialiased">
        <AmbientBackground />
        <DemoStateProvider>
          <AudioBootstrap />
          <SiteHeader />
          <main className="relative">{children}</main>
          <SiteFooter />
          <CommandMenu />
          <VerificationPoller />
          <Toaster
            theme="dark"
            position="bottom-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: "rgba(12, 18, 36, 0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(16px)",
                color: "#e5e9f0",
                fontSize: "14px",
              },
            }}
          />
        </DemoStateProvider>
      </body>
    </html>
  );
}
