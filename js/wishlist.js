const colors = ["#f7d59a", "#f4b8c0", "#c9b5e8", "#c9dfbd", "#f1b986", "#bda7e6", "#dcd5fa", "#cfeee8"];

let currentUser = null;
let wishlistItems = []; // array of listing objects (joined via favorites)

async function loadUser() {
  const { data: { user } } = await sb.auth.getUser();
  currentUser = user;
}

async function fetchWishlist() {
  if (!currentUser) {
    wishlistItems = [];
    return;
  }

  const { data, error } = await sb
    .from('favorites')
    .select(`
      listing_id,
      listings (
        id, title, description, price, images, status,
        profiles!listings_seller_id_fkey(full_name, hostel),
        categories(name)
      )
    `)
    .eq('user_id', currentUser.id);

  if (error) {
    console.error('Failed to load wishlist:', error);
    wishlistItems = [];
    return;
  }

  // filter out favorites whose listing was deleted or is no longer active
  wishlistItems = (data || [])
    .map(row => row.listings)
    .filter(listing => listing && listing.status === 'active');
}

function renderWishlist() {
  const grid = document.getElementById("wishlistGrid");
  const empty = document.getElementById("wishlistEmpty");
  const count = document.getElementById("wishlistCount");

  if (!currentUser) {
    count.textContent = "0 items";
    grid.innerHTML = "";
    empty.style.display = "grid";
    empty.querySelector("h2").textContent = "Log in to see your wishlist";
    empty.querySelector("p").textContent = "Your saved products live here once you're signed in.";
    empty.querySelector("a").textContent = "Login / Sign up";
    empty.querySelector("a").href = "login.html";
    return;
  }

  count.textContent = `${wishlistItems.length} ${wishlistItems.length === 1 ? "item" : "items"}`;
  empty.style.display = wishlistItems.length ? "none" : "grid";

  grid.innerHTML = wishlistItems.map((listing, index) => {
    const name = listing.title;
    const price = `₹${listing.price}`;
    const location = listing.profiles?.hostel || 'Location not set';
    const img = listing.images?.[0] || null;

    const mediaContent = img
      ? `<img src="${img}" alt="${name}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid';" />
         <div class="illustration image-fallback" style="display:none">${name}</div>`
      : `<div class="illustration image-fallback">${name}</div>`;

    return `
      <article class="wishlist-card">
        <div class="wishlist-media" style="background:${colors[index % colors.length]}">
          ${mediaContent}
        </div>
        <div class="wishlist-info">
          <h2>${name}</h2>
          <div class="wishlist-price">${price}</div>
          <div class="wishlist-location">${location}</div>
          <button class="remove-wishlist" type="button" data-remove="${listing.id}">Remove</button>
        </div>
      </article>
    `;
  }).join("");
}

document.getElementById("wishlistGrid").addEventListener("click", async (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button || !currentUser) return;

  const id = button.dataset.remove;
  button.disabled = true;

  const { error } = await sb
    .from('favorites')
    .delete()
    .eq('user_id', currentUser.id)
    .eq('listing_id', id);

  if (error) {
    console.error('Failed to remove favorite:', error);
    button.disabled = false;
    return;
  }

  wishlistItems = wishlistItems.filter(listing => String(listing.id) !== id);
  renderWishlist();
});

async function init() {
  await loadUser();
  await fetchWishlist();
  renderWishlist();
}

init();