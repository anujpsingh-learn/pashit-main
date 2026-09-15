let allListings = [];
const colors = ["#f7d59a", "#f4b8c0", "#c9b5e8", "#c9dfbd", "#f1b986", "#bda7e6", "#dcd5fa", "#cfeee8"];

let currentUser = null;
let savedIds = new Set(); // set of listing_id strings the current user has favorited

async function loadUserAndFavorites() {
  const { data: { user } } = await sb.auth.getUser();
  currentUser = user;

  if (!user) {
    savedIds = new Set();
    return;
  }

  const { data, error } = await sb
    .from('favorites')
    .select('listing_id')
    .eq('user_id', user.id);

  if (error) {
    console.error('Failed to load favorites:', error);
    savedIds = new Set();
    return;
  }

  savedIds = new Set((data || []).map(f => String(f.listing_id)));
}

function updateWishCount() {
  const el = document.getElementById("wishCount");
  if (el) el.textContent = savedIds.size;
}

async function fetchListings() {
  const { data, error } = await sb
    .from('listings')
    .select('id, title, description, price, images, created_at, profiles!listings_seller_id_fkey(full_name, hostel), categories(name)')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    document.getElementById("allListingsGrid").innerHTML =
      `<p class="empty-state">Couldn't load listings right now.</p>`;
    return;
  }

  allListings = data;
  renderAllListings(allListings);
}

function renderAllListings(items) {
  const grid = document.getElementById("allListingsGrid");
  const countEl = document.getElementById("listingCount");

  if (countEl) countEl.textContent = `${allListings.length} student listing${allListings.length === 1 ? "" : "s"}`;

  if (!items.length) {
    grid.innerHTML = `<p class="empty-state">No listings match yet — check back soon.</p>`;
    return;
  }

  grid.innerHTML = items.map((listing, index) => {
    const name = listing.title;
    const price = `₹${listing.price}`;
    const location = listing.profiles?.hostel || 'Location not set';
    const category = listing.categories?.name || 'Other';
    const img = listing.images?.[0] || null;
    const isSaved = savedIds.has(String(listing.id));

    const mediaContent = img
      ? `<img src="${img}" alt="${name}" class="listing-image" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
         <div class="image-fallback" style="display:none;background:${colors[index % colors.length]}">${name}</div>`
      : `<div class="image-fallback" style="background:${colors[index % colors.length]}">${name}</div>`;

    return `
      <article class="listing-card">
        <div class="listing-media">
          ${mediaContent}
          <span class="status-badge">${category}</span>
          <button class="wishlist-btn ${isSaved ? "is-saved" : ""}" type="button" data-wish="${listing.id}" aria-label="Save ${name}" aria-pressed="${isSaved}">
            <i data-lucide="heart" width="19" height="19"></i>
          </button>
        </div>
        <div class="listing-info">
          <h2 class="listing-name">${name}</h2>
          <p class="listing-price">${price}</p>
          <p class="listing-location"><i data-lucide="map-pin" width="14" height="14"></i> ${location}</p>
          <div class="listing-actions">
            <div class="listing-metrics">
              <span class="metric"><i data-lucide="eye" width="13" height="13"></i> ${8 + index}</span>
              <span class="metric"><i data-lucide="message-circle" width="13" height="13"></i> ${(index % 4) + 1}</span>
            </div>
            <button class="chat-btn" type="button" aria-label="Chat about ${name}">
              <i data-lucide="message-circle" width="15" height="15"></i> Chat
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  lucide.createIcons();
}

document.getElementById("allListingsGrid").addEventListener("click", async (event) => {
  const button = event.target.closest("[data-wish]");
  if (!button) return;

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const id = button.dataset.wish;
  const isCurrentlySaved = savedIds.has(id);

  // optimistic UI update
  button.disabled = true;
  if (isCurrentlySaved) {
    savedIds.delete(id);
  } else {
    savedIds.add(id);
  }
  button.classList.toggle("is-saved", !isCurrentlySaved);
  button.setAttribute("aria-pressed", String(!isCurrentlySaved));
  updateWishCount();

  let error;
  if (isCurrentlySaved) {
    ({ error } = await sb
      .from('favorites')
      .delete()
      .eq('user_id', currentUser.id)
      .eq('listing_id', id));
  } else {
    ({ error } = await sb
      .from('favorites')
      .insert({ user_id: currentUser.id, listing_id: id }));
  }

  if (error) {
    console.error('Failed to update favorite:', error);
    // revert on failure
    if (isCurrentlySaved) { savedIds.add(id); } else { savedIds.delete(id); }
    button.classList.toggle("is-saved", isCurrentlySaved);
    button.setAttribute("aria-pressed", String(isCurrentlySaved));
    updateWishCount();
  }

  button.disabled = false;
});

document.getElementById("allListingsSearch").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document.getElementById("allListingsInput").value.trim().toLowerCase();

  const matches = allListings.filter(listing =>
    `${listing.title} ${listing.description || ''} ${listing.categories?.name || ''}`.toLowerCase().includes(query)
  );

  renderAllListings(query ? matches : allListings);
});

document.getElementById("allListingsClear").addEventListener("click", () => {
  document.getElementById("allListingsInput").value = "";
  renderAllListings(allListings);
});

async function init() {
  await loadUserAndFavorites();
  await fetchListings();
  updateWishCount();
}

init();