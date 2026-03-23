const fs = require('fs');
let text = fs.readFileSync('src/app/page.js', 'utf8');

const sIdx = text.indexOf('          let targetAmount = 0;');
const eIdx = text.indexOf('          // Attempt on-chain interaction');

if (sIdx !== -1 && eIdx !== -1) {
    const start = text.substring(0, sIdx);
    const end = text.substring(eIdx);
    
    const middle =           let targetAmount = parseInt(mintAmount, 10);
          let zkProof = "0x0000";

          try {
            const res = await fetch("/api/verify", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ projectId: mintProjectId, claimedAmount: mintAmount })
            });
            const result = await res.json();
            
            if (!res.ok || !result.verified) {
               throw new Error(result.error);
            }
            zkProof = result.zkProof;
          } catch(err) {
             setIsMinting(false);
             toast.error(err.message, { duration: 8000 });
             return; // STOP!
          }\n\n;
          
     fs.writeFileSync('src/app/page.js', start + middle + end);
     console.log('SUCCESS: React Frontend now strictly bounded to the Backend.');
} else {
    console.log('FAILED to find exact boundaries via Node. sIdx: ' + sIdx + ', eIdx: ' + eIdx);
}
