const fs = require('fs');
let code = fs.readFileSync('src/app/page.js', 'utf8');

const s1 = 'const [mintAmount, setMintAmount] = useState("");';
if (code.includes(s1)) {
    code = code.replace(s1, s1 + '\n  const [auditLogs, setAuditLogs] = useState([]);');
    fs.writeFileSync('src/app/page.js', code);
    console.log("Added state");
} else { console.log("Missing state hook anchor"); }
