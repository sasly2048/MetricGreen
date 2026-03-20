const fs = require('fs');
const lines = fs.readFileSync('src/app/page.js', 'utf8').split('\n');
let start = 973; 

let end = -1;
for(let i=start; i<lines.length; i++) {
  if (lines[i].includes('{/* Ledger Panel */}')) {
     end = i; break;
  }
}

console.log('Start:', start, 'End:', end);

const newUI = `                  <div className="space-y-6 relative z-10">
                    
                    {/* Step 01 & Inputs Combined */}
                    <div className="relative overflow-hidden p-1 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 shadow-lg group hover:border-emerald-500/20 transition-all duration-500">
                      <div className="bg-neutral-900/80 rounded-xl p-5 md:p-6 backdrop-blur-md relative z-10 space-y-6">
                        
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-white/5 pb-5">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-widest font-mono font-semibold">
                                <Lock className={\`w-3.5 h-3.5 \${hasRegistered ? "text-emerald-400" : ""}\`} />
                                Step 01
                              </span>
                              {isRegistering && <Activity className="w-4 h-4 text-emerald-500 animate-spin" />}
                              {hasRegistered && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                            </div>
                            <h3 className={\`text-xl font-bold transition-colors duration-300 \${hasRegistered ? "text-emerald-400" : "text-white"}\`}>
                              {isRegistering ? "Verifying Certificate..." : hasRegistered ? "Certificate Verified" : "Register Credentials"}
                            </h3>
                            <p className="text-sm text-neutral-500 mt-1 font-mono flex items-center gap-2">
                              Status: <span className={\`font-bold px-2 py-0.5 rounded-md transition-all duration-300 \${hasRegistered ? "text-neutral-900 bg-emerald-500" : "text-emerald-500 bg-emerald-500/10"}\`}>{hasRegistered ? "Live on-chain" : "Unregistered"}</span>
                            </p>
                          </div>
                          
                          <motion.button
                            whileHover={!isRegistering && !hasRegistered ? { scale: 1.05 } : {}}
                            whileTap={!isRegistering && !hasRegistered ? { scale: 0.95 } : {}}
                            onClick={() => {
                              if (!hasRegistered) {
                                uiSounds.tap();
                                registerCertificate();
                              }
                            }}
                            onMouseEnter={() => !isRegistering && !hasRegistered && uiSounds.hover()}
                            disabled={isRegistering || hasRegistered}
                            className={\`px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md mt-1 md:mt-0 whitespace-nowrap \${hasRegistered ? "bg-emerald-900/40 text-emerald-500/50 cursor-not-allowed border border-emerald-500/20" : "bg-white text-black hover:bg-emerald-400"}\`}
                          >
                            {isRegistering ? "Verifying..." : hasRegistered ? "Registered" : "Register Project"}
                          </motion.button>
                        </div>

                        {/* Input Fields */}
                        <div className="space-y-4">
                          <div className="flex flex-col">
                            <label className="text-[10px] uppercase tracking-wider font-mono text-neutral-500 mb-1.5 ml-1">Project Name</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Amazon Reforestation"
                              value={mintProjectName}
                              onChange={(e) => setMintProjectName(e.target.value)}
                              className="bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-950/10 transition-all placeholder:text-neutral-700 hover:border-white/10"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="flex flex-col md:col-span-5">
                              <label className="text-[10px] uppercase tracking-wider font-mono text-neutral-500 mb-1.5 ml-1">Registry standard</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Verra"
                                value={mintRegistryName}
                                onChange={(e) => setMintRegistryName(e.target.value)}
                                className="bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-950/10 transition-all placeholder:text-neutral-700 w-full hover:border-white/10"
                              />
                            </div>
                            <div className="flex flex-col md:col-span-4">
                              <label className="text-[10px] uppercase tracking-wider font-mono text-neutral-500 mb-1.5 ml-1">Project ID</label>
                              <input 
                                type="text" 
                                placeholder="e.g. VCS-001"
                                value={mintProjectId}
                                onChange={(e) => setMintProjectId(e.target.value)}
                                className="bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-950/10 transition-all placeholder:text-neutral-700 w-full hover:border-white/10"
                              />
                            </div>
                            <div className="flex flex-col md:col-span-3">
                              <label className="text-[10px] uppercase tracking-wider font-mono text-neutral-500 mb-1.5 ml-1">Credits Amt</label>
                              <input 
                                type="number" 
                                placeholder="0"
                                value={mintAmount}
                                min="1"
                                onChange={(e) => setMintAmount(e.target.value)}
                                className="bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-950/10 transition-all placeholder:text-neutral-700 w-full hover:border-white/10"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 02 Minting Action */}
                    <motion.div 
                      whileHover={hasRegistered && !isMinting ? { scale: 1.01 } : {}}
                      whileTap={hasRegistered && !isMinting ? { scale: 0.99 } : {}}
                      onClick={() => {
                        if (!hasRegistered) {
                          uiSounds.error();
                          toast.error("Complete Step 01 to Register First.");
                          return;
                        }
                        uiSounds.tap();
                        mint();
                      }}
                      onMouseEnter={() => uiSounds.hover()}
                      className={\`group/btn relative overflow-hidden rounded-2xl p-6 text-left border transition-all duration-700 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-5 \${!hasRegistered ? "bg-neutral-900/20 border-white/5 grayscale pointer-events-none" : isMinting ? "bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.15)]" : "bg-gradient-to-br from-neutral-900/60 to-black hover:from-emerald-950/30 hover:to-neutral-900 border-emerald-500/20 hover:border-emerald-400"}\`}
                    >
                      <div className={\`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] transition-opacity duration-300 \${!isMinting && hasRegistered && "mix-blend-overlay group-hover/btn:opacity-[0.15]"}\`} />
                      
                      {/* Background slide effect for whole card */}
                      {!isMinting && hasRegistered && (
                        <span className="absolute inset-0 bg-emerald-500/5 w-0 transition-all duration-500 ease-out group-hover/btn:w-full"></span>
                      )}

                      <div className="relative z-10 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={\`flex items-center gap-2 text-xs uppercase tracking-widest font-mono font-semibold transition-colors duration-500 \${isMinting ? "text-emerald-300" : hasRegistered ? "text-emerald-400" : "text-neutral-600"}\`}>
                            <ShieldCheck className="w-4 h-4" /> Step 02
                          </span>
                        </div>
                        <h3 className={\`text-xl font-bold flex items-center gap-2 transition-colors duration-500 \${isMinting ? "text-emerald-400 animate-pulse" : hasRegistered ? "text-white" : "text-neutral-600"}\`}>
                          {isMinting ? "Generating ZK-Proof..." : "Verify & Mint Credentials"}
                        </h3>
                        <p className={\`text-sm mt-1 font-mono transition-colors duration-500 \${isMinting ? "text-emerald-200/60" : hasRegistered ? "text-emerald-100/60" : "text-neutral-700"}\`}>
                          Target ID: <span className={\`font-bold px-2 py-0.5 rounded-md border transition-colors duration-500 \${hasRegistered ? "text-white bg-black/40 border-white/10" : "text-neutral-600 bg-neutral-900/50 border-transparent"}\`}>{mintProjectId || "VCS-001"}</span>
                        </p>
                      </div>

                      <div className={\`relative z-10 px-6 py-3.5 rounded-xl font-bold flex items-center justify-center min-w-[180px] overflow-hidden transition-all duration-500 \${isMinting ? "bg-emerald-900/80 text-emerald-400 border border-emerald-500/50" : !hasRegistered ? "bg-neutral-800 text-neutral-600" : "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover/btn:shadow-[0_0_40px_rgba(16,185,129,0.6)]"}\`}>
                        <span className="relative z-10 flex items-center">
                          {isMinting ? (
                            <><Activity className="w-5 h-5 mr-2 animate-spin" /> Processing</>
                          ) : (
                            <>
                              Mint Credit 
                              <motion.div
                                initial={{ x: 0, opacity: 0, width: 0, marginLeft: 0 }}
                                animate={{ x: 0, opacity: 1, width: 'auto', marginLeft: 8 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden hidden group-hover/btn:flex items-center"
                              >
                                <ArrowRight className="w-5 h-5" />
                              </motion.div>
                              <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:hidden opacity-50" />
                            </>
                          )}
                        </span>
                      </div>
                    </motion.div>
                  </div>`;

if (start > -1 && end > -1) {
  lines.splice(start, end - start, newUI);
  fs.writeFileSync('src/app/page.js', lines.join('\n'));
  console.log("Written successfully!");
} else {
  console.log("Could not find boundaries.");
}
