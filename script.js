const products = [
  {
    name: "Signature Glacier Block",
    desc: 'Crystal-clear, slow-tempered cubes cut to a perfect 2.25".',
    price: "$28",
    tag: "Limited",
    color: "linear-gradient(135deg, #7ee8fa, #80ffea)",
  },
  {
    name: "Aurora Sphere Set",
    desc: "Spheres infused with aurora shimmer for glass-forward pours.",
    price: "$32",
    tag: "Glow",
    color: "linear-gradient(135deg, #9b8cff, #7ee8fa)",
  },
  {
    name: "Obsidian Fracture",
    desc: "Dark-charcoal chips for smoky spirits and nightcaps.",
    price: "$18",
    tag: "Small batch",
    color: "linear-gradient(135deg, #1f273d, #9b8cff)",
  },
  {
    name: "Tundra Sticks",
    desc: "Stir-ready spears designed for highballs and spritzes.",
    price: "$22",
    tag: "Bar ready",
    color: "linear-gradient(135deg, #80ffea, #ffd166)",
  },
  {
    name: "Runic Crest Stamp",
    desc: "Custom crest pressed into each cube for ceremonial service.",
    price: "$15",
    tag: "Custom",
    color: "linear-gradient(135deg, #ffd166, #ff7eb6)",
  },
  {
    name: "Polar Smoke Capsule",
    desc: "Aromatics you can freeze into cubes for a drifting fog pour.",
    price: "$24",
    tag: "New",
    color: "linear-gradient(135deg, #7ee8fa, #9b8cff)",
  },
];

const lootTable = [
  { name: "Prismatic Core", rarity: "Legendary", weight: 2, color: "#ff7eb6" },
  { name: "Aurora Edge", rarity: "Epic", weight: 6, color: "#9b8cff" },
  { name: "Glacial Crest", rarity: "Rare", weight: 18, color: "#7ee8fa" },
  {
    name: "Frostline Sample",
    rarity: "Uncommon",
    weight: 28,
    color: "#80ffea",
  },
  { name: "Carbon Chill", rarity: "Common", weight: 46, color: "#8fa4c3" },
];

const rarityWeights = lootTable.reduce((acc, item) => acc + item.weight, 0);
let displayName = "";

function refreshBannerState() {
  const bannerText = document.getElementById("bannerText");
  const bannerForm = document.getElementById("bannerForm");
  const clearButton = document.getElementById("clearName");
  const banner = document.getElementById("loginBanner");

  const active = Boolean(displayName);
  banner.classList.toggle("active", active);
  bannerForm.classList.toggle("has-name", active);
  clearButton.style.display = active ? "inline-flex" : "none";

  if (active) {
    bannerText.innerHTML = `<strong>Session active.</strong> Welcome, ${displayName}. Portal pulls will log to your name.`;
  } else {
    bannerText.innerHTML = `<strong>Claim your lab pass.</strong> Save a display name to track pulls and inventory.`;
  }
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = products
    .map(
      (product) => `
    <article class="card">
      <span class="badge" style="background:${product.color}">${product.tag}</span>
      <h3>${product.name}</h3>
      <p class="tagline">${product.desc}</p>
      <div class="price">${product.price}</div>
    </article>
  `,
    )
    .join("");
}

function renderRarityMeter() {
  const bars = document.getElementById("rarityBars");
  bars.innerHTML = lootTable
    .map((item) => {
      const percent = Math.round((item.weight / rarityWeights) * 100);
      return `
      <div class="meter-row">
        <span>${item.rarity}</span>
        <div class="meter-track">
          <div class="meter-fill" style="width:${percent}%;background:${item.color}"></div>
        </div>
        <div class="percent">${percent}%</div>
      </div>
    `;
    })
    .join("");
}

function renderLegend() {
  const legend = document.getElementById("rarityLegend");
  legend.innerHTML = lootTable
    .map(
      (item) => `
    <div class="legend-item">
      <span class="legend-swatch" style="background:${item.color}"></span>
      <div>
        <strong>${item.rarity}</strong>
        <div class="muted">${item.name}</div>
      </div>
    </div>
  `,
    )
    .join("");
}

function updateSessionUI() {
  const status = document.getElementById("sessionStatus");
  const pill = displayName ? `Logged in as ${displayName}` : "Guest session";
  status.textContent = pill;
  document.getElementById("inventoryStatus").textContent = displayName
    ? "Live"
    : "Locked";
  document.getElementById("historyStatus").textContent = displayName
    ? displayName
    : "Guest";

  document
    .getElementById("inventoryPanel")
    .classList.toggle("locked", !displayName);
  document
    .getElementById("historyPanel")
    .classList.toggle("locked", !displayName);

  refreshBannerState();
}

function saveName() {
  const input = document.getElementById("nameInput");
  const name = input.value.trim();
  if (!name) return;
  displayName = name;
  localStorage.setItem("displayName", displayName);
  input.value = "";
  updateSessionUI();
  loadInventory();
  loadHistory();
  document.getElementById("dropResult").textContent =
    `Session locked to ${displayName}. Engage portal when ready.`;
}

function loadName() {
  displayName = localStorage.getItem("displayName") || "";
  updateSessionUI();
  if (displayName) {
    document.getElementById("dropResult").textContent =
      `Welcome back, ${displayName}. Engage the portal when ready.`;
  }
}

function clearName() {
  localStorage.removeItem("displayName");
  displayName = "";
  updateSessionUI();
  loadInventory();
  loadHistory();
  document.getElementById("dropResult").textContent = "Awaiting input.";
  document.getElementById("nameInput").focus();
}

function weightedPull() {
  const roll = Math.random() * rarityWeights;
  let cursor = 0;
  for (const item of lootTable) {
    cursor += item.weight;
    if (roll <= cursor) return item;
  }
  return lootTable[lootTable.length - 1];
}

function getInventoryKey() {
  return displayName ? `inventory_${displayName}` : null;
}

function loadInventory() {
  const grid = document.getElementById("inventoryGrid");
  if (!displayName) {
    grid.innerHTML = `<div class="muted">Save a display name to track inventory.</div>`;
    return;
  }
  const key = getInventoryKey();
  const stored = JSON.parse(localStorage.getItem(key) || "{}");
  grid.innerHTML = lootTable
    .map((item) => {
      const count = stored[item.rarity] || 0;
      return `
      <div class="inventory-card" style="border-color:${item.color}33">
        <span>${item.rarity}</span>
        <div class="muted">${item.name}</div>
        <strong>${count} pulled</strong>
      </div>
    `;
    })
    .join("");
}

function loadHistory() {
  const list = document.getElementById("historyList");
  if (!displayName) {
    list.innerHTML = `<li class="muted">Pull history unlocks after you save a name.</li>`;
    return;
  }
  const history = JSON.parse(
    localStorage.getItem(`history_${displayName}`) || "[]",
  );
  if (!history.length) {
    list.innerHTML = `<li class="muted">No pulls yet. Engage the portal.</li>`;
    return;
  }
  list.innerHTML = history
    .slice(-6)
    .reverse()
    .map(
      (entry) => `
    <li><strong>${entry.item}</strong> · ${entry.rarity} · ${new Date(entry.time).toLocaleString()}</li>
  `,
    )
    .join("");
}

function savePull(item) {
  const key = getInventoryKey();
  if (!key) return;
  const inv = JSON.parse(localStorage.getItem(key) || "{}");
  inv[item.rarity] = (inv[item.rarity] || 0) + 1;
  localStorage.setItem(key, JSON.stringify(inv));

  const historyKey = `history_${displayName}`;
  const history = JSON.parse(localStorage.getItem(historyKey) || "[]");
  history.push({ item: item.name, rarity: item.rarity, time: Date.now() });
  localStorage.setItem(historyKey, JSON.stringify(history.slice(-50)));
}

function animatePortal() {
  const ring = document.querySelector(".portal-ring");
  ring.classList.add("flash");
  setTimeout(() => ring.classList.remove("flash"), 600);
}

function engagePortal() {
  if (!displayName) {
    document.getElementById("dropResult").textContent =
      "Save a display name to log your pulls.";
    document.getElementById("nameInput").focus();
    return;
  }
  animatePortal();
  const pull = weightedPull();
  savePull(pull);
  document.getElementById("dropResult").innerHTML =
    `<strong>${pull.name}</strong> unlocked · <span style="color:${pull.color}">${pull.rarity}</span>`;
  loadInventory();
  loadHistory();
}

function wireCtas() {
  document.querySelectorAll("[data-target]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = link.getAttribute("data-target");
      if (target) {
        e.preventDefault();
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function init() {
  renderProducts();
  renderRarityMeter();
  renderLegend();
  loadName();
  loadInventory();
  loadHistory();

  document.getElementById("saveName").addEventListener("click", saveName);
  document
    .getElementById("nameInput")
    .addEventListener("keydown", (e) => e.key === "Enter" && saveName());
  document.getElementById("clearName").addEventListener("click", clearName);
  document
    .getElementById("unboxButton")
    .addEventListener("click", engagePortal);
  document.getElementById("labCta").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("unboxButton").focus();
  });
  wireCtas();
}

document.addEventListener("DOMContentLoaded", init);
