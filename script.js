class Block {
  constructor(index, data, prevHash = "") {
    this.index = index;
    this.timestamp = new Date().toLocaleString();
    this.data = data;
    this.prevHash = prevHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return CryptoJS.SHA256(
      this.index + this.timestamp + this.data + this.prevHash + this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== "0".repeat(difficulty)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }

  isValid(prevBlock) {
    return this.prevHash === prevBlock.hash &&
           this.hash === this.calculateHash();
  }
}

let chain = [];
let difficulty = 3;

function addBlock() {
  const data = document.getElementById("dataInput").value || "(empty)";
  const prevHash = chain.length ? chain[chain.length - 1].hash : "0";
  const newBlock = new Block(chain.length, data, prevHash);

  newBlock.mineBlock(difficulty);
  chain.push(newBlock);

  document.getElementById("dataInput").value = "";
  renderChain();
}

function renderChain() {
  const container = document.getElementById("blockchain");
  container.innerHTML = "";
  chain.forEach((block, i) => {
    const blockDiv = document.createElement("div");
    blockDiv.className = "block";

    // Check chain validity
    if (i > 0 && !block.isValid(chain[i - 1])) {
      blockDiv.classList.add("invalid");
    }

    blockDiv.innerHTML = `
      <p><strong>Index:</strong> ${block.index}</p>
      <p><strong>Timestamp:</strong> ${block.timestamp}</p>
      <p><strong>Data:</strong> 
        <input value="${block.data}" onchange="updateData(${i}, this.value)" />
      </p>
      <p><strong>Nonce:</strong> 
        <input type="number" value="${block.nonce}" onchange="updateNonce(${i}, this.value)" />
      </p>
      <p><strong>Prev Hash:</strong> ${block.prevHash}</p>
      <p><strong>Hash:</strong> ${block.hash}</p>
    `;
    container.appendChild(blockDiv);
  });
}

function updateData(i, value) {
  chain[i].data = value;
  chain[i].hash = chain[i].calculateHash();
  if (chain[i + 1]) chain[i + 1].prevHash = chain[i].hash;
  renderChain();
}

function updateNonce(i, value) {
  chain[i].nonce = parseInt(value);
  chain[i].hash = chain[i].calculateHash();
  if (chain[i + 1]) chain[i + 1].prevHash = chain[i].hash;
  renderChain();
}

function simulateConsensus() {
  const miner = { power: Math.floor(Math.random() * 100) };
  const staker = { stake: Math.floor(Math.random() * 100) };
  const voters = [
    { name: "Voter A", vote: "Alice" },
    { name: "Voter B", vote: "Bob" },
    { name: "Voter C", vote: "Alice" }
  ];

  const powWinner = `PoW Winner: Miner with power ${miner.power}`;
  const posWinner = `PoS Winner: Staker with stake ${staker.stake}`;
  const voteCounts = voters.reduce((acc, v) => {
    acc[v.vote] = (acc[v.vote] || 0) + 1;
    return acc;
  }, {});
  const dposWinner = `DPoS Winner: ${Object.entries(voteCounts).sort((a,b)=>b[1]-a[1])[0][0]}`;

  document.getElementById("consensusOutput").innerText =
    `${powWinner}\n${posWinner}\n${dposWinner}`;
}

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});