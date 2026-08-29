"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ChevronDown, LogOut, Copy, Check, Settings, ExternalLink, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useWallet, useDemoState } from "@/lib/demo-state";
import { cn, shortenAddress } from "@/lib/utils";
import { currentChain, chains } from "@/lib/data";
import { sfx, getAudioSettings, setAudioEnabled } from "@/lib/sfx";

const walletOptions = [
  { id: "metamask", label: "MetaMask", hint: "Most popular", popular: true, color: "#f6851b" },
  { id: "walletconnect", label: "WalletConnect", hint: "Mobile + hardware", color: "#3b99fc" },
  { id: "coinbase", label: "Coinbase Wallet", hint: "Self-custodial", color: "#1652f0" },
  { id: "demo", label: "Demo Account", hint: "No install required", color: "#10b981" },
];

function generateAddress() {
  return "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

const ENS_POOL = [
  "atmosforest.eth",
  "heimdal.eth",
  "pacificblue.eth",
  "sahelsoil.eth",
  "sunrise-mr.eth",
  null,
  null,
];

const BALANCE_POOL = ["1.2841", "3.9172", "0.5782", "12.0048", "0.2941"];

export function WalletPicker({ onClose, onSelect, connecting }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-md sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-t-2xl border border-white/10 bg-[#0a1020] shadow-2xl shadow-black/60 sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/5 p-5">
          <div>
            <h2 className="font-display text-[18px] font-semibold leading-tight tracking-tight text-white">Connect a wallet</h2>
            <p className="mt-0.5 text-[13px] leading-snug text-ink-400">Choose how you&apos;d like to authenticate.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-[20px] leading-none text-ink-300 transition hover:bg-white/5 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-1 p-3">
          {walletOptions.map((opt) => {
            const loading = connecting === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  sfx.click();
                  onSelect(opt.id);
                }}
                disabled={!!connecting}
                className="group flex w-full items-center gap-4 rounded-xl p-3 text-left transition hover:bg-white/[0.04] disabled:opacity-50"
              >
                <div
                  className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-[15px] font-bold leading-none text-white"
                  style={{ background: `${opt.color}22` }}
                >
                  {opt.label[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[13.5px] font-medium leading-tight text-white">{opt.label}</p>
                    {opt.popular && (
                      <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-emerald-300 leading-none">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[12px] leading-snug text-ink-400">{opt.hint}</p>
                </div>
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                ) : (
                  <ChevronDown className="-rotate-90 text-ink-500 group-hover:text-ink-200" />
                )}
              </button>
            );
          })}
        </div>

        <div className="border-t border-white/5 bg-white/[0.02] p-4 text-[11px] leading-snug text-ink-400">
          <p className="flex items-start gap-2">
            <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            By connecting, you agree to the <span className="text-ink-200 underline">Terms of Service</span> and{" "}
            <span className="text-ink-200 underline">Privacy Policy</span>. MetricGreen never custodies your keys.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function WalletButton() {
  const { wallet, connect, disconnect } = useWallet();
  const { dispatch } = useDemoState();
  const [open, setOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [connecting, setConnecting] = useState(null);
  const [copied, setCopied] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);
  const [audioOn, setAudioOn] = useState(getAudioSettings().enabled);

  const onConnect = async (provider) => {
    setConnecting(provider);
    setPickerOpen(false);
    await new Promise((r) => setTimeout(r, 1100));

    if (provider === "demo") {
      connect({
        provider,
        address: "0x8f7b3a4c2d1e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
        ensName: "atmosforest.eth",
        balance: "1.2841",
        chainId: 11155111,
      });
    } else {
      const ens = ENS_POOL[Math.floor(Math.random() * ENS_POOL.length)];
      connect({
        provider,
        address: generateAddress(),
        ensName: ens,
        balance: BALANCE_POOL[Math.floor(Math.random() * BALANCE_POOL.length)],
        chainId: 11155111,
      });
    }
    sfx.connect();
    toast.success(
      provider === "demo"
        ? "Demo wallet connected"
        : `${walletOptions.find((w) => w.id === provider)?.label} connected`,
    );
    setConnecting(null);
  };

  const onCopy = () => {
    if (!wallet.address) return;
    navigator.clipboard?.writeText(wallet.address);
    setCopied(true);
    sfx.confirm();
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  const onSwitchNetwork = (chain) => {
    connect({ chainId: chain.chainId });
    sfx.switch();
    toast.success(`Switched to ${chain.name}`);
    setNetworkOpen(false);
  };

  const onToggleAudio = () => {
    const next = !audioOn;
    setAudioEnabled(next);
    setAudioOn(next);
    if (next) sfx.click();
    toast(next ? "Sound effects enabled" : "Sound effects muted", { duration: 2000 });
  };

  const onDisconnect = () => {
    sfx.error();
    disconnect();
    setOpen(false);
    toast.info("Wallet disconnected");
  };

  // Not connected
  if (!wallet.provider) {
    return (
      <>
        <button
          onClick={() => {
            sfx.click();
            setPickerOpen(true);
          }}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md bg-gradient-to-b from-emerald-400 to-emerald-600 px-3.5 py-2 text-[13px] font-semibold text-emerald-950 shadow-[0_0_24px_-6px_rgba(16,185,129,0.6)] transition hover:from-emerald-300 hover:to-emerald-500 active:scale-95"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
          />
          <Wallet className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Connect Wallet</span>
        </button>

        <AnimatePresence>
          {pickerOpen && (
            <WalletPicker
              onClose={() => setPickerOpen(false)}
              onSelect={onConnect}
              connecting={connecting}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // Connected
  return (
    <div className="relative">
      <button
        onClick={() => {
          sfx.click();
          setOpen((o) => !o);
        }}
        className={cn(
          "flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/[0.06] px-2.5 py-1.5 text-[13px] text-emerald-200 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 sm:px-3",
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="font-mono text-[12px] leading-none">
          {wallet.ensName || shortenAddress(wallet.address)}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 opacity-50 transition-transform leading-none", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full z-40 mt-2 w-72 overflow-hidden rounded-xl border border-white/10 bg-[#0a1020]/95 shadow-2xl shadow-black/50 backdrop-blur-2xl"
            >
              <div className="border-b border-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[9.5px] uppercase tracking-widest text-ink-500 leading-none">Account</p>
                    <p className="mt-1.5 font-display text-[15px] font-semibold leading-tight tracking-tight text-white">
                      {wallet.ensName || shortenAddress(wallet.address, 6)}
                    </p>
                  </div>
                  <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-2">
                    <Wallet className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                </div>
                <button
                  onClick={onCopy}
                  className="mt-3 flex w-full items-center justify-between rounded-md bg-white/[0.04] px-2.5 py-1.5 text-left font-mono text-[11px] leading-tight text-ink-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <span>{shortenAddress(wallet.address, 8)}</span>
                  {copied ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 divide-x divide-white/5 border-b border-white/5">
                <div className="p-3">
                  <p className="font-mono text-[9.5px] uppercase tracking-widest text-ink-500 leading-none">Balance</p>
                  <p className="mt-1 font-mono text-[14px] font-semibold leading-none text-white">
                    {wallet.balance} <span className="text-[10.5px] text-ink-400">ETH</span>
                  </p>
                </div>
                <div className="relative p-3">
                  <button
                    onClick={() => setNetworkOpen((o) => !o)}
                    className="w-full text-left"
                  >
                    <p className="font-mono text-[9.5px] uppercase tracking-widest text-ink-500 leading-none">Network</p>
                    <p className="mt-1 flex items-center justify-between font-mono text-[14px] font-semibold leading-none text-white">
                      {currentChain.short}
                      <ChevronDown className={cn("h-3 w-3 opacity-50 transition", networkOpen && "rotate-180")} />
                    </p>
                  </button>
                  <AnimatePresence>
                    {networkOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute left-0 right-3 top-full z-50 mt-1 overflow-hidden rounded-md border border-white/10 bg-[#0a1020] shadow-xl"
                      >
                        {chains.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => onSwitchNetwork(c)}
                            className="flex w-full items-center justify-between px-3 py-2 text-left text-[12px] hover:bg-white/5"
                          >
                            <span className="text-white">{c.name}</span>
                            {wallet.chainId === c.chainId && <Check className="h-3 w-3 text-emerald-400" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="p-1.5">
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] leading-tight text-ink-200 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Account Settings
                </Link>
                <a
                  href={currentChain.explorer + "/address/" + wallet.address}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] leading-tight text-ink-200 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View on Explorer
                </a>
                <button
                  onClick={onToggleAudio}
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] leading-tight text-ink-200 transition hover:bg-white/[0.05] hover:text-white"
                >
                  {audioOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                  Sound Effects
                  <span className="ml-auto font-mono text-[9.5px] uppercase tracking-widest text-ink-500 leading-none">
                    {audioOn ? "On" : "Off"}
                  </span>
                </button>
                <div className="my-1 h-px bg-white/5" />
                <button
                  onClick={onDisconnect}
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] leading-tight text-rose-300 transition hover:bg-rose-500/10"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Disconnect
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
