import pathlib

content = pathlib.Path('src/app/page.js').read_text(encoding='utf-8')
start_str = '          let targetAmount = 0;'
end_str = '          // Attempt on-chain interaction\n          try {\n            const finalAmount'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_middle = '''          let targetAmount = parseInt(mintAmount, 10);
          let zkProof = "0x0000";

          try {
            console.log("[Sensor Fusion] Verifying claim with backend...");
            const res = await fetch("/api/verify", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ projectId: mintProjectId, claimedAmount: mintAmount })
            });
            const result = await res.json();
            
            if (!res.ok || !result.verified) {
               throw new Error(result.error || "Verification Failed");
            }
            zkProof = result.zkProof;
          } catch(err) {
             console.error(err);
             setIsMinting(false);
             toast.error(err.message, { duration: 6000 });
             return; // STOP MINTING! Return early!
          }

'''
    new_content = content[:start_idx] + new_middle + content[end_idx:]
    pathlib.Path('src/app/page.js').write_text(new_content, encoding='utf-8')
    print("SUCCESS")
elif start_idx == -1:
    print("Failed: Start Not Found")
else:
    print("Failed: End Not Found")
