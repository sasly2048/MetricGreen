"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Wallet, Sparkles, Check, Lock, Coins, AlertCircle } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Page, PageHeader, Section } from "@/components/ui/Page";
import { ConfettiBurst, SuccessRing, AnimatedCheck } from "@/components/ui/MicroInteractions";
import { useDemoState } from "@/lib/demo-state";
import { toast } from "sonner";
import { sfx } from "@/lib/sfx";

const steps = [
  { id: 1, label: "Project", desc: "Methodology & registry" },
  { id: 2, label: "Mint", desc: "Verify & mint first credit" },
  { id: 3, label: "Done", desc: "Live on chain" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const { state, dispatch } = useDemoState();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [registry, setRegistry] = useState("Verra");
  const [projectId, setProjectId] = useState("");
  const [category, setCategory] = useState("Reforestation");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("100");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confettiKey, setConfettiKey] = useState(0);

  const isProducer = !!state.producer.id;

  const onRegister = async () => {
    setError("");
    if (!name.trim()) { setError("Project name is required"); sfx.error(); return; }
    if (!projectId.trim()) { setError("Registry project ID is required"); sfx.error(); return; }
    if (!location.trim()) { setError("Location is required"); sfx.error(); return; }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    dispatch({
      type: "REGISTER_CERT",
      payload: { certId: projectId, timestamp: new Date().toISOString() },
    });
    setSubmitting(false);
    sfx.success();
    setStep(2);
    toast.success("VCS001 certificate registered on-chain", {
      description: `${name} is now linked to your wallet.`,
    });
  };

  const onMint = async () => {
    const num = parseInt(amount, 10);
    if (!num || num < 1) {
      sfx.error();
      toast.error("Enter an amount of at least 1 tCO₂e");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, claimedAmount: amount }),
      });
      const data = await res.json();
      if (!res.ok || !data.verified) {
        sfx.error();
        toast.error(data.error || "Verification failed");
        setSubmitting(false);
        return;
      }
      await new Promise((r) => setTimeout(r, 1500));
      setConfettiKey((k) => k + 1);
      sfx.success();
      setStep(3);
      toast.success(`Minted ${num} tCO₂e for ${name}`);
    } catch (e) {
      sfx.error();
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!state.wallet.provider) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <Card className="p-10">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-amber-500/20 bg-amber-500/10">
            <Wallet className="h-5 w-5 text-amber-300" />
          </div>
          <h2 className="mt-5 font-display text-[20px] font-semibold leading-tight tracking-tight text-white">Connect a wallet to continue</h2>
          <p className="mt-2 text-[13.5px] leading-snug text-ink-400">
            You&apos;ll need a connected wallet to register projects and mint credits.
          </p>
          <Button as={Link} href="/" className="mt-5" leftIcon={<Wallet className="h-4 w-4" />}>
            Connect Wallet
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <Page size="narrow">
      <Link
        href="/projects"
        className="group inline-flex items-center gap-1 text-[12px] leading-none text-ink-400 transition hover:text-white"
      >
        <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
        Projects
      </Link>

      <PageHeader
        eyebrow="New Project"
        title="Register & mint"
        description="Three steps. Total time: under 90 seconds."
        className="mt-5"
      />

      <Stepper step={step} />

      <Section>
        {step === 1 && (
          <Card className="relative overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative">
              <CardHeader
                eyebrow="Step 1"
                title="Project details"
                description="Tell us about the methodology and registry certificate."
              />
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                <Input
                  label="Project Name *"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="e.g. Manauary Reforestation"
                  className="sm:col-span-2"
                />
                <Select label="Registry" value={registry} onChange={(e) => setRegistry(e.target.value)}>
                  <option>Verra</option>
                  <option>Gold Standard</option>
                  <option>CAR</option>
                  <option>ACR</option>
                </Select>
                <Input
                  label="Registry Project ID *"
                  value={projectId}
                  onChange={(e) => { setProjectId(e.target.value); setError(""); }}
                  placeholder="e.g. VCS-9341"
                />
                <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="sm:col-span-2">
                  {["Reforestation", "Direct Air Capture", "Renewable Energy", "Blue Carbon", "Methane Capture", "Soil Sequestration"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
                <Input
                  label="Location *"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setError(""); }}
                  placeholder="e.g. Amazon Basin, Brazil"
                  className="sm:col-span-2"
                />
                <Textarea
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe the project's methodology, partners, and impact…"
                  className="sm:col-span-2"
                  rows={3}
                />
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/[0.05] p-3 text-[12px] leading-snug text-rose-300">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {error}
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-white/[0.05] pt-5">
                <Button as={Link} href="/projects" variant="ghost">Cancel</Button>
                <Button onClick={onRegister} loading={submitting} leftIcon={<ShieldCheck className="h-4 w-4" />}>
                  Register VCS001
                </Button>
              </div>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="relative overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
            <ConfettiBurst trigger={confettiKey} />
            <div className="relative">
              <CardHeader
                eyebrow="Step 2"
                title="Mint your first credit"
                description="Verify sensor data and submit a zero-knowledge proof to chain."
              />
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 text-[13.5px]">
                  <KVLine k="Project" v={name || "Untitled"} />
                  <KVLine k="Registry" v={`${registry} · ${projectId}`} />
                  <KVLine k="Category" v={category} />
                  <KVLine k="Location" v={location || "—"} />
                  <KVLine k="Reputation bond" v="1.00 ETH (refundable)" />
                </div>

                <Input
                  label="Amount to mint (tCO₂e)"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  leftIcon={<Coins className="h-4 w-4" />}
                  hint="Sensor data will be cross-checked for this batch"
                />
              </div>

              <div className="mt-6 flex items-center justify-between gap-2 border-t border-white/[0.05] pt-5">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={onMint} loading={submitting} leftIcon={<Sparkles className="h-4 w-4" />}>
                  Verify & Mint
                </Button>
              </div>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="relative overflow-hidden p-8 text-center">
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="relative">
              <div className="relative mx-auto grid h-16 w-16 place-items-center">
                <SuccessRing trigger={confettiKey} color="#10b981" />
                <AnimatedCheck size={64} />
              </div>
              <h2 className="mt-6 font-display text-[22px] font-semibold leading-tight tracking-tight text-white">Project registered & credit minted</h2>
              <p className="mt-2 text-[13.5px] leading-snug text-ink-400">
                Your first {amount} tCO₂e credit is now on the chain. A 7-day challenge
                window is open for third-party verifiers.
              </p>

              <div className="mx-auto mt-6 max-w-md rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 text-left text-[13.5px]">
                <KVLine k="Project" v={name} />
                <KVLine k="Registry" v={`${registry} · ${projectId}`} />
                <KVLine k="Amount minted" v={`${amount} tCO₂e`} />
                <KVLine k="Challenge ends" v="7 days from now" />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <Button as={Link} href="/projects" variant="secondary">Back to Projects</Button>
                <Button as={Link} href="/dashboard">View Dashboard</Button>
              </div>
            </div>
          </Card>
        )}
      </Section>
    </Page>
  );
}

function KVLine({ k, v }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.04] py-2 leading-none last:border-0">
      <span className="text-[12px] text-ink-400">{k}</span>
      <span className="text-[12.5px] text-ink-100">{v}</span>
    </div>
  );
}

function Stepper({ step }) {
  return (
    <ol className="mt-6 flex items-center gap-2">
      {steps.map((s, i) => {
        const done = step > s.id;
        const active = step === s.id;
        return (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <div
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-[11px] font-semibold leading-none transition-all ${
                done
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                  : active
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-[0_0_16px_-4px_rgba(16,185,129,0.5)]"
                    : "border-white/10 bg-white/[0.04] text-ink-400"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : s.id}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`truncate text-[12px] font-medium leading-tight ${active || done ? "text-white" : "text-ink-500"}`}>{s.label}</p>
              <p className="truncate font-mono text-[9.5px] uppercase tracking-widest text-ink-500 leading-none">{s.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px flex-1 ${done ? "bg-emerald-500/40" : "bg-white/[0.08]"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
