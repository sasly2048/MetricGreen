const fs = require('fs');
let code = fs.readFileSync('src/app/page.js', 'utf8');

const p1 = code.indexOf('let targetAmount = 0;');
const p2 = code.indexOf('// Attempt on-chain interaction', p1);

if (p1 > -1 && p2 > -1) {
   const start = code.substring(0, p1);
   const end = code.substring(p2);
   const middle = "let targetAmount = parseInt(mintAmount, 10);\n\n          let zkProof = '0x0000';\n\n          try {\n            const res = await fetch('/api/verify', {\n               method: 'POST',\n               headers: { 'Content-Type': 'application/json' },\n               body: JSON.stringify({ projectId: mintProjectId, claimedAmount: mintAmount })\n            });\n            const result = await res.json();\n            \n            if (!res.ok || !result.verified) {\n               throw new Error(result.error || 'Verification Failed');\n            }\n            zkProof = result.zkProof;\n          } catch(err) {\n             console.error('[Sensor Fusion Error]', err);\n             setIsMinting(false);\n             uiSounds.error();\n             toast.error(err.message, { duration: 6000 });\n             return; \n          }\n\n          ";
          
   fs.writeFileSync('src/app/page.js', start + middle + end);
   console.log("REPLACED SUCCESSFULLY!");
} else {
   console.log("NOT FOUND", p1, p2);
}
