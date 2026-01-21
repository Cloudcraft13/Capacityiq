// CapacityIQ Prototype - Demo only (no backend)

const warehouses = [
  {
    id: "luton-logistics-hub",
    name: "Luton Logistics Hub",
    location: "Luton, LU1",
    palletsAvailable: 140,
    maxCapacity: 600,
    pricePerPalletDay: 1.25,
    features: ["CCTV", "Fire Safety", "Access Control"],
    notes: "Ideal for eCommerce overflow and seasonal stock."
  },
  {
    id: "mk-fulfilment-park",
    name: "MK Fulfilment Park",
    location: "Milton Keynes, MK10",
    palletsAvailable: 220,
    maxCapacity: 900,
    pricePerPalletDay: 1.10,
    features: ["CCTV", "24/7 Access", "Loading Bays"],
    notes: "Good transport links. Suitable for importers."
  },
  {
    id: "birmingham-3pl-centre",
    name: "Birmingham 3PL Centre",
    location: "Birmingham, B7",
    palletsAvailable: 90,
    maxCapacity: 520,
    pricePerPalletDay: 1.35,
    features: ["CCTV", "Insurance Option", "Forklift Service"],
    notes: "Fast onboarding for SMEs. Flexible terms."
  }
];

function getParams() {
  const p = new URLSearchParams(window.location.search);
  return Object.fromEntries(p.entries());
}

function money(n) {
  return "£" + Number(n).toFixed(2);
}

function renderSearchResults() {
  const list = document.getElementById("resultsList");
  if (!list) return;

  const params = getParams();
  const loc = (params.location || "Luton").trim();
  const pallets = Number(params.pallets || 50);

  document.getElementById("searchSummary").textContent =
    `Showing warehouses near "${loc}" for ~${pallets} pallets (demo data)`;

  list.innerHTML = warehouses.map(w => {
    return `
      <div class="item">
        <div>
          <h3>${w.name}</h3>
          <div class="meta">${w.location}</div>
          <div class="kpis">
            <div class="kpi">Available: ${w.palletsAvailable} pallets</div>
            <div class="kpi">Price: ${money(w.pricePerPalletDay)} / pallet / day</div>
          </div>
          <div class="small" style="margin-top:10px;">${w.notes}</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px; min-width:180px;">
          <a class="btn" href="details.html?id=${w.id}">View Details</a>
          <a class="btn secondary" href="dashboard.html?warehouse=${w.id}">Owner Dashboard</a>
        </div>
      </div>
    `;
  }).join("");
}

function renderDetails() {
  const el = document.getElementById("details");
  if (!el) return;

  const { id } = getParams();
  const w = warehouses.find(x => x.id === id) || warehouses[0];

  el.innerHTML = `
    <div class="card">
      <h2 style="margin:0 0 6px;">${w.name}</h2>
      <div class="small">${w.location}</div>
      <hr />
      <div class="row">
        <div class="kpi">Current Available: ${w.palletsAvailable} pallets</div>
        <div class="kpi">Max Capacity: ${w.maxCapacity} pallets</div>
        <div class="kpi">Rate: ${money(w.pricePerPalletDay)} / pallet / day</div>
      </div>
      <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
        ${w.features.map(f => `<span class="badge ok">✓ ${f}</span>`).join("")}
      </div>

      <div class="footerNote">
        Demo note: In the real system, capacity would update in real time via warehouse dashboard / WMS integration.
      </div>
    </div>
  `;

  const bookLink = document.getElementById("bookLink");
  if (bookLink) {
    bookLink.href = `confirmation.html?id=${w.id}`;
  }
}

function renderDashboard() {
  const el = document.getElementById("dash");
  if (!el) return;

  const { warehouse } = getParams();
  const w = warehouses.find(x => x.id === warehouse) || warehouses[0];

  el.innerHTML = `
    <div class="card">
      <h2 style="margin:0 0 6px;">Warehouse Dashboard — ${w.name}</h2>
      <div class="small">${w.location} • Demo view</div>
      <hr />
      <div class="row">
        <div class="kpi">Available: ${w.palletsAvailable}</div>
        <div class="kpi">Occupied: ${w.maxCapacity - w.palletsAvailable}</div>
        <div class="kpi">Max: ${w.maxCapacity}</div>
      </div>

      <div style="margin-top:14px;" class="row">
        <button class="btn" id="decreaseBtn">-10 pallets</button>
        <button class="btn" id="increaseBtn">+10 pallets</button>
        <button class="btn secondary" id="saveBtn">Save Update (Demo)</button>
      </div>

      <div style="margin-top:14px;">
        <h3 style="margin:0 0 8px;">Booking Requests (Demo)</h3>
        <div class="item">
          <div>
            <div style="font-weight:800;">Request #1001</div>
            <div class="meta">50 pallets • 2 weeks • Goods: eCommerce stock</div>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn secondary" onclick="alert('Approved (demo)')">Approve</button>
            <button class="btn secondary" onclick="alert('Declined (demo)')">Decline</button>
          </div>
        </div>

        <div class="item" style="margin-top:10px;">
          <div>
            <div style="font-weight:800;">Request #1002</div>
            <div class="meta">25 pallets • 10 days • Goods: importer cartons</div>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn secondary" onclick="alert('Approved (demo)')">Approve</button>
            <button class="btn secondary" onclick="alert('Declined (demo)')">Decline</button>
          </div>
        </div>
      </div>

      <div class="footerNote">
        Demo note: In the real system, updates would go through an API Gateway to Capacity Service and be stored in a database.
      </div>
    </div>
  `;

  // simple demo capacity change
  let current = w.palletsAvailable;
  const dec = document.getElementById("decreaseBtn");
  const inc = document.getElementById("increaseBtn");
  const save = document.getElementById("saveBtn");

  const updateTitle = () => {
    // re-render KPIs without rebuilding whole card
    const kpis = el.querySelectorAll(".kpi");
    if (kpis.length >= 3) {
      kpis[0].textContent = `Available: ${current}`;
      kpis[1].textContent = `Occupied: ${w.maxCapacity - current}`;
      kpis[2].textContent = `Max: ${w.maxCapacity}`;
    }
  };

  dec?.addEventListener("click", () => {
    current = Math.max(0, current - 10);
    updateTitle();
  });

  inc?.addEventListener("click", () => {
    current = Math.min(w.maxCapacity, current + 10);
    updateTitle();
  });

  save?.addEventListener("click", () => {
    alert("Saved (demo). In the real product, this would update the live capacity.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSearchResults();
  renderDetails();
  renderDashboard();
});
