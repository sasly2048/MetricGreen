"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Bell, Shield, Key, CreditCard, Webhook, Copy, Check, Plus,
  Eye, EyeOff, LogOut, Trash2, RefreshCw, Mail, Volume2, VolumeX,
  PlayCircle, Code, Sparkles,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Page } from "@/components/ui/Page";
import { useDemoState, useWallet } from "@/lib/demo-state";
import { toast } from "sonner";
import { cn, shortenAddress } from "@/lib/utils";
import { getAudioSettings, setAudioEnabled, setAudioVolume, setAudioMode, sfx } from "@/lib/sfx";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "audio", label: "Audio", icon: Volume2 },
  { id: "api", label: "API Keys", icon: Key },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
];

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const { state } = useDemoState();
  const { disconnect } = useWallet();
  const router = useRouter();

  if (!state.wallet.provider) {
    return (
      <Page size="narrow">
        <Card className="p-10 text-center">
          <User className="mx-auto h-9 w-9 text-amber-300" />
          <h2 className="mt-4 font-display text-[20px] font-semibold leading-tight tracking-tight text-white">Sign in to view settings</h2>
          <p className="mt-2 text-[13.5px] leading-snug text-ink-400">Connect a wallet to manage your account.</p>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-56">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5">
            {tabs.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13.5px] font-medium tracking-tight transition",
                    tab === t.id
                      ? "bg-white/[0.06] text-white"
                      : "text-ink-300 hover:bg-white/[0.03] hover:text-white",
                  )}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 flex-1 space-y-5">
          {tab === "profile" && <ProfileTab />}
          {tab === "notifications" && <NotificationsTab />}
          {tab === "security" && <SecurityTab onDisconnect={() => { disconnect(); router.push("/"); }} />}
          {tab === "audio" && <AudioTab />}
          {tab === "api" && <ApiKeysTab />}
          {tab === "billing" && <BillingTab />}
          {tab === "webhooks" && <WebhooksTab />}
        </div>
      </div>
    </Page>
  );
}

function ProfileTab() {
  const { state } = useDemoState();
  const [displayName, setDisplayName] = useState(state.wallet.ensName || "");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  return (
    <Card className="p-6 sm:p-8">
      <CardHeader eyebrow="Profile" title="Public information" description="This is how others will see you on the protocol." />
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-emerald-500/30 to-emerald-500/0 font-display text-[18px] font-bold leading-none text-white">
            {(state.wallet.ensName || state.wallet.address).slice(0, 2).toUpperCase()}
          </div>
          <div>
            <Button size="sm" variant="secondary">Upload avatar</Button>
            <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-widest text-ink-500 leading-none">PNG, JPG, or GIF · max 2MB</p>
          </div>
        </div>
        <Input label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <Input label="Email (private)" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@organization.com" leftIcon={<Mail className="h-3.5 w-3.5" />} />
        <Textarea label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short bio visible on your producer profile." />
        <div className="flex justify-end">
          <Button onClick={() => toast.success("Profile updated")}>Save changes</Button>
        </div>
      </div>
    </Card>
  );
}

function NotificationsTab() {
  const items = [
    { id: "mint", label: "Mint events", desc: "Notify me when my projects mint new credits", def: true },
    { id: "retire", label: "Retirement events", desc: "Notify me when credits I own are retired", def: true },
    { id: "challenge", label: "Challenge window", desc: "Alert me 24h before a challenge window closes", def: true },
    { id: "marketplace", label: "Marketplace activity", desc: "Bids, listings, and offers on my credits", def: false },
    { id: "audit", label: "Audit events", desc: "New attestations and disputes on my projects", def: true },
    { id: "weekly", label: "Weekly digest", desc: "Summary of network activity every Monday", def: false },
  ];

  return (
    <Card className="p-6 sm:p-8">
      <CardHeader eyebrow="Notifications" title="Email & push" description="Choose what you want to be notified about." />
      <ul className="mt-4 divide-y divide-white/[0.04]">
        {items.map((it) => (
          <NotifRow key={it.id} {...it} />
        ))}
      </ul>
    </Card>
  );
}

function NotifRow({ label, desc, def }) {
  const [on, setOn] = useState(def);
  return (
    <li className="flex items-center justify-between gap-3 py-3.5">
      <div>
        <p className="text-[13.5px] font-medium leading-tight text-white">{label}</p>
        <p className="mt-0.5 text-[11.5px] leading-snug text-ink-400">{desc}</p>
      </div>
      <button
        onClick={() => { setOn((o) => !o); sfx.tick(); }}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border transition-all",
          on ? "border-emerald-500/40 bg-emerald-500/20" : "border-white/10 bg-white/[0.05]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full transition-transform",
            on ? "translate-x-5 bg-emerald-300" : "translate-x-0.5 bg-white",
          )}
        />
      </button>
    </li>
  );
}

function SecurityTab({ onDisconnect }) {
  return (
    <div className="space-y-5">
      <Card className="p-6 sm:p-8">
        <CardHeader eyebrow="Security" title="Active sessions" description="Manage where you're signed in." />
        <ul className="mt-4 space-y-3">
          <SessionItem device="Chrome on macOS" location="San Francisco, CA" current />
          <SessionItem device="Safari on iOS" location="San Francisco, CA" />
        </ul>
      </Card>

      <Card className="p-6 sm:p-8">
        <CardHeader eyebrow="Two-factor" title="Authentication" description="Protect your account with 2FA." />
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 text-[13.5px]">
            <div>
              <p className="font-medium leading-tight text-white">Authenticator app</p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-ink-400">Use Google Authenticator or 1Password</p>
            </div>
            <Badge tone="amber">Not configured</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 text-[13.5px]">
            <div>
              <p className="font-medium leading-tight text-white">Hardware key</p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-ink-400">YubiKey, Ledger, or Trezor</p>
            </div>
            <Badge tone="success">Connected</Badge>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <CardHeader eyebrow="Danger zone" title="Account actions" description="These actions are irreversible." />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" leftIcon={<LogOut className="h-4 w-4" />} onClick={onDisconnect}>
            Disconnect wallet
          </Button>
          <Button variant="danger" leftIcon={<Trash2 className="h-4 w-4" />}>
            Delete account
          </Button>
        </div>
      </Card>
    </div>
  );
}

function SessionItem({ device, location, current }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 text-[13.5px]">
      <div>
        <p className="font-medium leading-tight text-white">{device}</p>
        <p className="mt-0.5 text-[11.5px] leading-snug text-ink-400">{location} {current && "· Current session"}</p>
      </div>
      {current ? <Badge tone="success">Active</Badge> : <Button size="xs" variant="ghost">Revoke</Button>}
    </li>
  );
}

function AudioTab() {
  const [settings, setSettings] = useState(getAudioSettings());

  const toggle = () => {
    const next = !settings.enabled;
    setAudioEnabled(next);
    setSettings({ ...settings, enabled: next });
    if (next) sfx.success();
  };

  const setVolume = (v) => {
    setAudioVolume(v);
    setSettings({ ...settings, volume: v });
  };

  const setMode = (mode) => {
    setAudioMode(mode);
    setSettings({ ...settings, mode });
    sfx.tick();
    toast.success(`Audio mode: ${mode === "developer" ? "Developer" : "Normal"}`, {
      description: mode === "developer"
        ? "More frequent feedback for power users."
        : "Minimal feedback, key moments only.",
    });
  };

  const previewable = [
    { id: "success", label: "Success", desc: "Task complete" },
    { id: "error", label: "Error", desc: "Failure or rejection" },
    { id: "burn", label: "Burn", desc: "Permanent retirement" },
    { id: "proof", label: "Proof", desc: "ZK proof generation" },
    { id: "purchase", label: "Purchase", desc: "Order confirmed" },
    { id: "connect", label: "Connect", desc: "Wallet connect" },
    { id: "switch", label: "Switch", desc: "Network switch" },
    { id: "step", label: "Step", desc: "Stage advance" },
    { id: "notify", label: "Notify", desc: "Alert" },
  ];

  return (
    <Card className="p-6 sm:p-8">
      <CardHeader
        eyebrow="Audio"
        title="Sound effects"
        description="Subtle, tasteful feedback for important moments only. Built with the Web Audio API — no asset files."
      />

      <div className="mt-6 space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
          <div>
            <p className="font-medium leading-tight text-white">Sound effects</p>
            <p className="mt-0.5 text-[12.5px] leading-snug text-ink-400">Master enable / disable</p>
          </div>
          <button
            onClick={toggle}
            className={cn(
              "relative h-7 w-12 shrink-0 rounded-full border transition-all",
              settings.enabled ? "border-emerald-500/40 bg-emerald-500/20" : "border-white/10 bg-white/[0.05]",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-6 w-6 rounded-full shadow-md transition-transform",
                settings.enabled ? "translate-x-5 bg-emerald-300" : "translate-x-0.5 bg-white",
              )}
            />
          </button>
        </div>

        <div className="space-y-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500 leading-none">Mode</p>
            <p className="mt-1.5 text-[12.5px] leading-snug text-ink-500">
              Normal mutes the keyboard chatter; Developer adds tighter feedback for power users.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "normal", label: "Normal", desc: "Moments that matter", icon: Sparkles },
              { id: "developer", label: "Developer", desc: "Tighter feedback", icon: Code },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  "rounded-lg border p-3 text-left transition",
                  settings.mode === m.id
                    ? "border-emerald-500/40 bg-emerald-500/[0.06]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/10",
                )}
              >
                <div className="flex items-center gap-2">
                  <m.icon className={cn("h-3.5 w-3.5", settings.mode === m.id ? "text-emerald-300" : "text-ink-400")} />
                  <span className="text-[13px] font-medium leading-tight text-white">{m.label}</span>
                </div>
                <p className="mt-1.5 text-[11.5px] leading-snug text-ink-500">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className={cn("space-y-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition-opacity", !settings.enabled && "pointer-events-none opacity-40")}>
          <div className="flex items-center justify-between">
            <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500 leading-none">Volume</label>
            <span className="font-mono text-[12px] leading-none text-ink-300">{Math.round(settings.volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(settings.volume * 100)}
            onChange={(e) => setVolume(parseInt(e.target.value, 10) / 100)}
            className="w-full accent-emerald-500"
          />
        </div>

        <div className={cn("transition-opacity", !settings.enabled && "pointer-events-none opacity-40")}>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500 leading-none">Preview</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {previewable.map((s) => (
              <button
                key={s.id}
                onClick={() => sfx[s.id] && sfx[s.id]()}
                className="flex items-start gap-2.5 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 text-left transition hover:border-white/10 hover:bg-white/[0.04]"
              >
                <PlayCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <div className="min-w-0">
                  <p className="text-[12.5px] font-medium leading-tight text-white">{s.label}</p>
                  <p className="mt-0.5 text-[10.5px] leading-snug text-ink-500">{s.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function ApiKeysTab() {
  const [keys, setKeys] = useState([
    { id: "k1", label: "Production Sensor Gateway", prefix: "mg_live_a1b2c3", created: "2026-06-12", lastUsed: "2 hours ago" },
    { id: "k2", label: "Verifier Console (read-only)", prefix: "mg_live_d4e5f6", created: "2026-04-08", lastUsed: "3 days ago" },
  ]);
  const [showKey, setShowKey] = useState(null);
  const [copied, setCopied] = useState(null);

  return (
    <Card className="p-6 sm:p-8">
      <CardHeader
        eyebrow="API"
        title="API keys"
        description="Programmatic access to the MetricGreen protocol. Treat keys like passwords."
        action={
          <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => {
            const next = { id: "k" + Date.now(), label: "New key", prefix: "mg_live_" + Math.random().toString(16).slice(2, 8), created: new Date().toISOString().slice(0, 10), lastUsed: "Never" };
            setKeys((k) => [next, ...k]);
            toast.success("API key created. Copy it now — you won&apos;t see it again.");
          }}>
            Generate Key
          </Button>
        }
      />
      <ul className="mt-4 divide-y divide-white/[0.04]">
        {keys.map((k) => (
          <li key={k.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-[13.5px] font-medium leading-tight text-white">{k.label}</p>
              <div className="mt-1 flex items-center gap-2 font-mono text-[12px] leading-tight text-ink-300">
                <span>{k.prefix}{showKey === k.id ? "_showthispart_3f9a2b" : "••••••••"}</span>
                <button onClick={() => setShowKey(showKey === k.id ? null : k.id)} className="text-ink-400 hover:text-white">
                  {showKey === k.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </button>
                <button
                  onClick={() => { navigator.clipboard?.writeText(k.prefix); setCopied(k.id); toast.success("Copied"); setTimeout(() => setCopied(null), 1200); }}
                  className="text-ink-400 hover:text-white"
                >
                  {copied === k.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
              <p className="mt-1 font-mono text-[10.5px] leading-tight text-ink-500">Created {k.created} · Last used {k.lastUsed}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="xs" variant="ghost" leftIcon={<RefreshCw className="h-3 w-3" />}>Rotate</Button>
              <Button size="xs" variant="danger" leftIcon={<Trash2 className="h-3 w-3" />} onClick={() => setKeys((list) => list.filter((x) => x.id !== k.id))}>
                Revoke
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function BillingTab() {
  return (
    <Card className="p-6 sm:p-8">
      <CardHeader eyebrow="Billing" title="Plan & usage" description="You're on the Protocol plan — $0/month, gas-sponsored." />
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <UsageCard label="Mints (30d)" value="42" max="100" />
        <UsageCard label="API calls (30d)" value="1,247" max="10,000" />
        <UsageCard label="Storage (IPFS)" value="412 MB" max="2 GB" />
      </div>
      <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-[13.5px] leading-snug text-emerald-200">
        <p className="font-medium">All gas is sponsored via Paymaster.</p>
        <p className="mt-1 text-[12px] text-emerald-300/80">No transaction fees for verifiers, producers, or retirements on the base plan.</p>
      </div>
    </Card>
  );
}

function UsageCard({ label, value, max }) {
  const numeric = parseInt(value);
  const maxNum = parseInt(max);
  const pct = Number.isFinite(numeric) && Number.isFinite(maxNum) ? (numeric / maxNum) * 100 : 0;
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
      <p className="font-mono text-[9.5px] uppercase tracking-widest text-ink-500 leading-none">{label}</p>
      <p className="mt-1.5 font-display text-[18px] font-semibold leading-none text-white">{value} <span className="text-[12px] text-ink-400 font-normal">/ {max}</span></p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.05]">
        <div className="h-full rounded-full bg-emerald-500/60" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

function WebhooksTab() {
  const [endpoints, setEndpoints] = useState([
    { id: "w1", url: "https://api.atmosforest.io/hooks/metricgreen", events: ["credit.minted", "credit.retired"] },
  ]);
  const [newUrl, setNewUrl] = useState("");

  return (
    <Card className="p-6 sm:p-8">
      <CardHeader eyebrow="Webhooks" title="Event subscriptions" description="Receive real-time POST events to your own infrastructure." />
      <div className="mt-4 flex gap-2">
        <Input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="https://your-api.com/webhooks/metricgreen"
        />
        <Button onClick={() => {
          if (!newUrl) return;
          setEndpoints((e) => [...e, { id: "w" + Date.now(), url: newUrl, events: ["credit.minted"] }]);
          setNewUrl("");
          toast.success("Webhook endpoint added");
        }} leftIcon={<Plus className="h-4 w-4" />}>Add</Button>
      </div>

      <ul className="mt-5 space-y-3">
        {endpoints.map((w) => (
          <li key={w.id} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="break-all font-mono text-[12.5px] leading-tight text-white">{w.url}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {w.events.map((e) => (
                    <Badge key={e} tone="iris">{e}</Badge>
                  ))}
                </div>
              </div>
              <Button size="xs" variant="danger" leftIcon={<Trash2 className="h-3 w-3" />} onClick={() => setEndpoints((l) => l.filter((x) => x.id !== w.id))}>
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
