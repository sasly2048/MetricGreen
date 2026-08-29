"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/marketing/HeroSection";
import { LogoCloud } from "@/components/marketing/LogoCloud";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { SolutionSection } from "@/components/marketing/SolutionSection";
import { WorkflowSection } from "@/components/marketing/WorkflowSection";
import { StatsSection } from "@/components/marketing/StatsSection";
import { StackSection } from "@/components/marketing/StackSection";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { CTASection } from "@/components/marketing/CTASection";
import { WalletPicker } from "@/components/site/WalletButton";
import { useDemoState } from "@/lib/demo-state";
import { toast } from "sonner";
import { sfx } from "@/lib/sfx";

const ENS_POOL = ["atmosforest.eth", "heimdal.eth", "pacificblue.eth", "sahelsoil.eth", null, null];

export default function Home() {
  const { state, dispatch } = useDemoState();
  const router = useRouter();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [connecting, setConnecting] = useState(null);

  const handleConnect = () => {
    if (state.wallet.provider) {
      router.push("/dashboard");
    } else {
      setPickerOpen(true);
    }
  };

  const onSelect = async (provider) => {
    setConnecting(provider);
    setPickerOpen(false);
    sfx.whoosh();
    await new Promise((r) => setTimeout(r, 1000));

    if (provider === "demo") {
      dispatch({
        type: "CONNECT_WALLET",
        payload: {
          provider,
          address: "0x8f7b3a4c2d1e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
          ensName: "atmosforest.eth",
          balance: "1.2841",
          chainId: 11155111,
        },
      });
      dispatch({
        type: "REGISTER_CERT",
        payload: { certId: "VCS-9341", timestamp: new Date().toISOString() },
      });
      sfx.success();
      toast.success("Demo wallet connected", {
        description: "Seeded producer account loaded.",
      });
    } else {
      const ens = ENS_POOL[Math.floor(Math.random() * ENS_POOL.length)];
      dispatch({
        type: "CONNECT_WALLET",
        payload: {
          provider,
          address: "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
          ensName: ens,
          balance: (Math.random() * 3 + 0.5).toFixed(4),
          chainId: 11155111,
        },
      });
      sfx.success();
      toast.success(`${provider} connected`);
    }
    setConnecting(null);
    setTimeout(() => router.push("/dashboard"), 700);
  };

  return (
    <>
      <HeroSection onConnect={handleConnect} />
      <LogoCloud />
      <ProblemSection />
      <SolutionSection />
      <WorkflowSection />
      <StatsSection />
      <StackSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection onConnect={handleConnect} />

      {pickerOpen && (
        <WalletPicker
          onClose={() => setPickerOpen(false)}
          onSelect={onSelect}
          connecting={connecting}
        />
      )}
    </>
  );
}
