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

async mineBlock(difficulty, blockDiv) {
  const start = performance.now();
  let attempts = 0;
  
  blockDiv.innerHTML += '<p><strong>Mining Status:</strong> ⛏️ Mining...</p>'; 
  await new Promise((resolve) => setTimeout(resolve, 500)); 

  while (this.hash.substring(0, difficulty) !== "0".repeat(difficulty)) {
    this.nonce++;
    attempts++;
    this.hash = this.calculateHash();

    if (attempts % 500 === 0) {
      blockDiv.innerHTML = `<p><strong>Nonce Attempts:</strong> ${attempts}</p>
        <p><strong>Current Hash:</strong> ${this.hash}</p>
        <p><strong>Mining Status:</strong> ⛏️ Mining...</p>`;
      await new Promise((resolve) => setTimeout(resolve, 50)); 
    }
  }

  const end = performance.now();
  this.miningTime = (end - start).toFixed(2);
  this.attempts = attempts;

  blockDiv.innerHTML = `<p><strong>Nonce Attempts:</strong> ${this.attempts}</p>
    <p><strong>Mining Time:</strong> ${this.miningTime} ms</p>
    <p><strong>Final Hash:</strong> ${this.hash}</p>
    <p><strong>✅ Mining Completed!</strong></p>`;
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

  // Find the container for this block to pass to mineBlock
  const container = document.getElementById("blockchain");
  const blockDiv = document.createElement("div");
  blockDiv.className = "block";
  container.appendChild(blockDiv);

  newBlock.mineBlock(difficulty, blockDiv).then(() => {
    chain.push(newBlock);
    document.getElementById("dataInput").value = "";
    renderChain();
  });
  return;

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
      ${block.miningTime ? `
  <p><strong>Nonce Attempts:</strong> ${block.attempts}</p>
  <p><strong>Mining Time:</strong> ${block.miningTime} ms</p>
` : ''}
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