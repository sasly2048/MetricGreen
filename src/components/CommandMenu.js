"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import {
  Search,
  Wallet,
  Leaf,
  Activity,
  Settings,
  Code,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle the menu when ⌘K or ctrl+K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  return (
    <>
      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-indigo-600/80 backdrop-blur-md border border-indigo-500/30 text-white rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] md:hidden hover:bg-indigo-500 transition-all active:scale-95"
        aria-label="Open Command Menu"
      >
        <Search className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <Command label="Global Command Menu" className="w-full text-white">
              <div className="flex items-center px-4 py-4 border-b border-white/5">
                <Search className="w-5 h-5 text-neutral-400 mr-3" />
                <Command.Input
                  placeholder="Type a command or search..."
                  className="w-full bg-transparent border-none outline-none text-lg text-white placeholder:text-neutral-500 font-sans"
                  autoFocus
                />
              </div>

              <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-none">
                <Command.Empty className="py-10 text-center text-neutral-500">
                  No results found.
                </Command.Empty>

                <Command.Group
                  heading="Web3 Actions"
                  className="px-2 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider"
                >
                  <Command.Item
                    onSelect={() =>
                      runCommand(() => toast.success("Connecting wallet..."))
                    }
                    className="flex items-center px-3 py-3 mt-1 rounded-lg cursor-pointer hover:bg-white/10 aria-selected:bg-white/10 text-sm font-medium text-neutral-200 transition-colors duration-100"
                  >
                    <Wallet className="w-4 h-4 mr-3 text-indigo-400" />
                    Connect Wallet
                    <span className="ml-auto text-xs text-neutral-500 border border-white/10 px-2 py-0.5 rounded bg-black/20">
                      C
                    </span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() =>
                      runCommand(() =>
                        toast.promise(
                          new Promise((resolve) => setTimeout(resolve, 2000)),
                          {
                            loading: "Simulating Stake Transaction...",
                            success:
                              "VCS001 Certificate Staked. Gas saved: 0.005 ETH (Paymaster)",
                            error: "Simulation failed",
                          },
                        ),
                      )
                    }
                    className="flex items-center px-3 py-3 mt-1 rounded-lg cursor-pointer hover:bg-white/10 aria-selected:bg-white/10 text-sm font-medium text-neutral-200 transition-colors duration-100"
                  >
                    <Zap className="w-4 h-4 mr-3 text-emerald-400" />
                    Register VCS001 (Gasless)
                  </Command.Item>
                </Command.Group>

                <Command.Group
                  heading="Navigation"
                  className="px-2 py-3 mt-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider relative top-2"
                >
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/"))}
                    className="flex items-center px-3 py-3 mt-1 rounded-lg cursor-pointer hover:bg-white/10 aria-selected:bg-white/10 text-sm font-medium text-neutral-200"
                  >
                    <Activity className="w-4 h-4 mr-3 text-neutral-400" />
                    Dashboard
                  </Command.Item>
                  <Command.Item
                    onSelect={() =>
                      runCommand(() =>
                        toast.info("Opening MetricGreen smart contracts..."),
                      )
                    }
                    className="flex items-center px-3 py-3 mt-1 rounded-lg cursor-pointer hover:bg-white/10 aria-selected:bg-white/10 text-sm font-medium text-neutral-200"
                  >
                    <Code className="w-4 h-4 mr-3 text-neutral-400" />
                    View Smart Contracts
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
            {/* Helper footer */}
            <div className="bg-neutral-950 px-4 py-3 border-t border-white/5 flex justify-between items-center text-xs text-neutral-500">
              <span>
                Use{" "}
                <kbd className="bg-neutral-800 border border-white/10 px-1 py-0.5 rounded shadow-sm text-neutral-300">
                  ↑
                </kbd>{" "}
                <kbd className="bg-neutral-800 border border-white/10 px-1 py-0.5 rounded shadow-sm text-neutral-300">
                  ↓
                </kbd>{" "}
                to navigate
              </span>
              <span>
                <kbd className="bg-neutral-800 border border-white/10 px-1 py-0.5 rounded shadow-sm text-neutral-300">
                  Esc
                </kbd>{" "}
                to close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
