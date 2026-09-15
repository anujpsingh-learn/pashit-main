const colors = ["#f7d59a", "#f4b8c0", "#c9b5e8", "#c9dfbd", "#f1b986", "#bda7e6", "#dcd5fa", "#cfeee8"];

const products = [
  ["Books", "assets/books.svg", "BOOKS"],
  ["Headphones", "assets/headphones.svg", "AUDIO"],
  ["Bicycle", "assets/bicycle.svg", "CYCLE"],
  ["Backpack", "assets/backpack.svg", "BAG"],
  ["Watch", "assets/watch.svg", "WATCH"],
  ["Desk lamp", "assets/lamp.svg", "LAMP"]
];

const marketItems = [
  ["Headphones", "assets/headphones.svg", "Rs.1,200"],
  ["Bicycle", "assets/bicycle.svg", "Rs.2,800"],
  ["Table fan", "assets/fan.svg", "Rs.500"],
  ["Backpack", "assets/backpack.svg", "Rs.500"],
  ["Single bed", "assets/bed.svg", "Rs.3,000"],
  ["Bucket", "assets/bucket.svg", "Rs.3,000"],
  ["Shoes", "assets/shoes.svg", "Rs.700"],
  ["Desk lamp", "assets/lamp.svg", "Rs.350"]
];

const marketplaceSnapshot = {
  livePills: ["42 online", "Just listed", "2 chats active"],
  soldHighlight: "Sold in 3 hrs",
  stats: [
    ["1,200+", "Listings live"],
    ["87+", "Sold today"],
    ["42", "Online now"],
    ["94%", "Happy students"]
  ],
  recentProducts: [
    {
      student: "Rahul",
      meta: "BH-1",
      action: "listed",
      product: "Bicycle",
      avatar: "assets/rahul.svg",
      position: "left"
    },
    {
      student: "Ananya",
      meta: "",
      action: "listed",
      product: "Bucket",
      avatar: "assets/ananya.svg",
      position: "right"
    }
  ]
};

const categories = [
  ["Hostel Essentials", "Comfort, convenience and everything in between.", "HOSTEL", "large"],
  ["Study Zone", "Books, gear and tools for better learning.", "STUDY", "large"],
  ["Electronics & Appliances", "Smart tech, better living.", "TECH", ""],
  ["Sports Gear", "Play hard, stay active.", "SPORT", ""],
  ["Ride & Transport", "Bikes, rides and campus travel.", "RIDE", ""],
  ["Everything Else", "Random finds, real value.", "MORE", ""]
];

const listings = [
  ["Sony Headphones", "Rs.899", "BH-3, Room 115", "Just listed", "assets/headphones.svg", "AUDIO"],
  ["Mini Fridge", "Rs.4,500", "BH-1, Room 102", "Sold fast", "assets/fridge.svg", "FRIDGE"],
  ["Study Lamp", "Rs.350", "BH-2, Room 204", "Just listed", "assets/lamp.svg", "LAMP"],
  ["Nike Air Force 1", "Rs.1,799", "BH-4, Room 305", "Hot deal", "assets/nike-shoes.svg", "SHOES"],
  ["Backpack", "Rs.499", "Girls Hostel, G-2", "New today", "assets/backpack-black.svg", "BAG"],
  ["Badminton Set", "Rs.250", "BH-1, Sports Room", "Just listed", "assets/badminton.svg", "SPORT"],
  ["Office Chair", "Rs.2,200", "BH-2, Room 210", "Just listed", "assets/chair.svg", "CHAIR"],
  ["Induction Cooktop", "Rs.1,199", "BH-3, Room 118", "Hot deal", "assets/induction.svg", "COOK"],
  ["Suitcase", "Rs.1,299", "BH-1, Room 103", "Sold fast", "assets/suitcase.svg", "CASE"],
  ["Extension Board", "Rs.199", "BH-4, Room 302", "Just listed", "assets/extension-board.svg", "POWER"],
  ["Dumbbells 10kg", "Rs.899", "Gym, BH-1", "New today", "assets/dumbbells.svg", "GYM"],
  ["Water Bottle", "Rs.150", "Girls Hostel, G-1", "Just listed", "assets/bottle.svg", "BOTTLE"]
];

const team = [
  ["Subash Bhatta", "Co-founder", "assets/subash.png", "SB", "#f7d9bc"],
  ["Arpit Shah", "Co-founder", "assets/arpit.jpeg", "AS", "#efc3e4"],
  ["Anuj Pratap Singh", "Co-founder", "assets/anuj.jpg", "AP", "#d5c2ee"],
  ["Maybe You", "We're hiring builders, designers, and campus hustlers.", null, "+", "#bfeac2"]
];

const WISHLIST_STORAGE_KEY = "pashItWishlist";
const saved = new Set(JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) || "[]"));

const sellSteps = [
  {
    id: 1,
    kicker: "Step 1 of 4",
    title: "Snap & list",
    lead: "Take a photo. Add price.<br />Done in seconds.",
    muted: "No forms. No waiting.",
    link: "Next step ->",
    visual: `
      <div class="phone-scene">
        <div class="phone">
          <div class="phone-top">Create Listing</div>
          <div class="phone-photo">LAMP</div>
          <label>Title</label><div class="phone-field">Study Lamp</div>
          <label>Price</label><div class="phone-field accent">Rs.350</div>
          <button type="button">Post Listing -></button>
        </div>
        <span class="burst-badge">Posted</span>
      </div>
    `
  },
  {
    id: 2,
    kicker: "Step 2 of 4",
    title: "Get real<br />buyers",
    lead: "Only LPU students.<br />No random people.",
    muted: "Verified campus community you can trust.",
    link: "Next step ->",
    purple: true,
    visual: `
      <div class="buyer-board">
        <div class="note-card">Your campus.<br />Your people.</div>
        <div class="buyer-list-card">
          <strong>Buyers nearby</strong>
          <span>Rohan B. - LPU Verified</span>
          <span>Aanya S. - LPU Verified</span>
          <span>Karan M. - LPU Verified</span>
        </div>
      </div>
    `
  },
  {
    id: 3,
    kicker: "Step 3 of 4",
    title: "Chat & fix<br />price",
    lead: "Talk directly. No middleman.<br />You decide.",
    muted: "Clear chats. Fair deals. All on-campus.",
    link: "Next step ->",
    visual: `
      <div class="chat-phone">
        <div class="chat-head">Karan M. - Online</div>
        <p class="bubble left">Is this backpack still available?</p>
        <p class="bubble right">Yes, it is. Almost new.</p>
        <p class="bubble left">Can you do Rs.450?</p>
        <p class="bubble right">Sure, Rs.450 works.</p>
      </div>
    `
  },
  {
    id: 4,
    kicker: "Step 4 of 4",
    title: "Meet &<br />exchange",
    lead: "Meet at a safe campus spot.<br />Check the item. Make the swap.",
    muted: "No delivery. No strangers.",
    link: "Let's swap ->",
    purple: true,
    visual: `
      <div class="exchange-card">
        <span class="location-chip">Uni Mall - Meet here</span>
        <strong>Swap complete</strong>
        <p>Backpack sold for Rs.499</p>
        <button type="button">Leave a review</button>
      </div>
    `
  }
];

let activeSellStep = 1;

async function getMarketplaceSnapshot() {
  // Future backend hook: replace this return value with fetch("/api/marketplace/snapshot").
  return marketplaceSnapshot;
}

function illustration(label, index) {
  return `<div class="illustration" style="background:${colors[index % colors.length]}">${label}</div>`;
}

function productImage(src, alt, fallback, index) {
  return `<img src="${src}" alt="${alt}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid';" /><div class="illustration image-fallback" style="background:${colors[index % colors.length]}">${fallback}</div>`;
}

function renderHeroProducts() {
  document.getElementById("heroProducts").innerHTML = products
    .map(([name, src], index) => `<article class="product-card" aria-label="${name}">${productImage(src, name, name, index)}</article>`)
    .join("");
}

async function renderMarket() {
  const snapshot = await getMarketplaceSnapshot();
  const marketTrack = document.getElementById("marketTrack");
  document.getElementById("livePills").innerHTML = snapshot.livePills
    .map((label) => `<span class="live-pill">${label}</span>`)
    .join("");

  marketTrack.innerHTML = marketItems
    .map(([name, src, price], index) => `
      <article class="market-item" aria-label="${name}">
        ${productImage(src, name, name, index)}
        <span class="market-price">${price}</span>
      </article>
    `)
    .join("");

  snapshot.recentProducts.forEach((activity) => {
    marketTrack.insertAdjacentHTML("beforeend", `
      <div class="activity-card ${activity.position}" data-recent-product="${activity.product}">
        <img src="${activity.avatar}" alt="${activity.student}" onerror="this.style.display='none';" />
        <p><strong>${activity.student}${activity.meta ? ` (${activity.meta})` : ""}</strong><br />${activity.action} ${activity.product}</p>
      </div>
    `);
  });

  document.getElementById("soldPill").textContent = snapshot.soldHighlight;
  document.getElementById("statsPanel").innerHTML = snapshot.stats
    .map(([value, label]) => `<article class="stat"><strong>${value}</strong><span>${label}</span></article>`)
    .join("");
}

function renderCategories() {
  document.getElementById("categoryGrid").innerHTML = categories
    .map(([name, description, label, size], index) => `
      <article class="category-card ${size}" style="background:${colors[(index + 3) % colors.length]}">
        <h3 class="category-name">${name}</h3>
        <p class="category-description">${description}</p>
        <a class="category-btn" href="#latest-listings">Explore -></a>
        ${illustration(label, index + 2)}
      </article>
    `)
    .join("");
}

function renderListings(items = listings) {
  const grid = document.getElementById("listingsGrid");
  grid.innerHTML = items.length
    ? items.map(([name, price, location, status, src, label], index) => `
      <article class="listing-card" data-name="${name.toLowerCase()}">
        <div class="listing-media" style="background:${colors[index % colors.length]}">
          <span class="status-badge">${status}</span>
          <button class="wishlist-btn ${saved.has(name) ? "is-saved" : ""}" type="button" data-wish="${name}" aria-label="Save ${name}">${saved.has(name) ? "♥" : "♡"}</button>
          ${productImage(src, name, name, index)}
          <div class="listing-meta">
            <span class="meta-pill">${8 + index} views</span>
            <span class="meta-pill">${(index % 4) + 1} chats</span>
          </div>
        </div>
        <div class="listing-info">
          <h3 class="listing-name">${name}</h3>
          <div class="listing-price">${price}</div>
          <div class="listing-location">${location}</div>
          <button class="chat-btn" type="button" aria-label="Chat about ${name}">Chat</button>
        </div>
      </article>
    `).join("")
    : `<p class="empty-state">No listings match your search yet.</p>`;
}

function renderTeam() {
  document.getElementById("teamGrid").innerHTML = team
    .map(([name, role, avatar, initials, color]) => `
      <article class="team-card" style="background:${color}">
        <div class="avatar">
          ${avatar ? `<img src="${avatar}" alt="${name}" onerror="this.style.display='none';this.parentElement.textContent='${initials}';" />` : initials}
        </div>
        <h3 class="member-name">${name}</h3>
        <p class="member-role">${role}</p>
        <div class="social-row">
          <a href="#" aria-label="${name} X">X</a>
          <a href="#" aria-label="${name} LinkedIn">in</a>
        </div>
      </article>
    `)
    .join("");
}

function renderSellStep(stepNumber = 1) {
  const step = sellSteps.find((item) => item.id === stepNumber) || sellSteps[0];
  const content = document.getElementById("stepContent");
  const visual = document.getElementById("stepVisual");

  content.innerHTML = `
    <div class="step-copy">
      <p class="step-kicker ${step.purple ? "purple" : ""}">${step.kicker}</p>
      <h2 class="step-title">${step.title}</h2>
      <p class="step-lead">${step.lead}</p>
      <p class="step-muted">${step.muted}</p>
      <button class="step-link" type="button" data-next-step>${step.link}</button>
    </div>
  `;
  visual.innerHTML = step.visual;

  document.querySelectorAll(".step-tabs button").forEach((button) => {
    const isActive = Number(button.dataset.step) === step.id;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  activeSellStep = step.id;
  content.classList.remove("is-changing");
  visual.classList.remove("is-changing");
  void content.offsetWidth;
  content.classList.add("is-changing");
  visual.classList.add("is-changing");
}

function setupSellSteps() {
  const stepCard = document.querySelector(".step-card");
  if (!stepCard) return;

  stepCard.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-step]");
    if (tab) {
      renderSellStep(Number(tab.dataset.step));
      return;
    }

    const next = event.target.closest("[data-next-step]");
    if (next) {
      const nextStep = activeSellStep === sellSteps.length ? 1 : activeSellStep + 1;
      renderSellStep(nextStep);
    }
  });
}

function updateWishCount() {
  document.getElementById("wishCount").textContent = saved.size;
}

function saveWishlist() {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([...saved]));
}

function setupSearch() {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  const clear = document.getElementById("clearSearchBtn");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim().toLowerCase();
    const matches = listings.filter((listing) => listing.join(" ").toLowerCase().includes(query));
    renderListings(query ? matches : listings);
    document.getElementById("latest-listings").scrollIntoView({ behavior: "smooth" });
  });

  clear.addEventListener("click", () => {
    input.value = "";
    renderListings();
  });
}

function setupWishlists() {
  document.getElementById("listingsGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-wish]");
    if (!button) return;

    const name = button.dataset.wish;
    if (saved.has(name)) {
      saved.delete(name);
    } else {
      saved.add(name);
    }

    saveWishlist();
    updateWishCount();
    renderListings();
  });
}

function setupLocation() {
  const locationBtn = document.getElementById("locationBtn");
  const locationText = document.getElementById("locationText");

  locationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      locationText.textContent = "Location unavailable";
      return;
    }

    locationText.textContent = "Detecting...";
    navigator.geolocation.getCurrentPosition(
      () => {
        locationText.textContent = "Current location";
      },
      () => {
        locationText.textContent = "Enable location";
      }
    );
  });
}

renderHeroProducts();
renderMarket();
renderCategories();
renderListings();
renderTeam();
renderSellStep(1);
updateWishCount();
setupSearch();
setupWishlists();
setupLocation();
setupSellSteps();
