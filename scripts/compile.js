const fs = require("fs");
const solc = require("solc");
const source = fs.readFileSync("./contracts/MetricGreen.sol", "utf8");

const input = {
  language: "Solidity",
  sources: {
    "MetricGreen.sol": { content: source }
  },
  settings: { outputSelection: { "*": { "*": ["*"] } } }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
if (output.errors) {
  output.errors.forEach(e => console.error(e.formattedMessage));
} else {
  console.log("Compilation Successful!");
  const contract = output.contracts["MetricGreen.sol"].MetricGreen;
  console.log("ABI: ", JSON.stringify(contract.abi, null, 2));
}

