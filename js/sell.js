let selectedFiles = [];

async function loadCategories() {
  const { data, error } = await sb.from('categories').select('id, name').order('name');
  if (error) return;

  const select = document.getElementById('sellCategory');
  data.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}

function renderPreviews() {
  const row = document.getElementById('imagePreviewRow');
  row.innerHTML = '';
  selectedFiles.forEach(file => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    row.appendChild(img);
  });
}

document.getElementById('sellImages').addEventListener('change', (event) => {
  selectedFiles = Array.from(event.target.files).slice(0, 5); // cap at 5 photos
  renderPreviews();
});

document.getElementById('sellForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const session = await requireAuth();
  if (!session) return;

  const submitBtn = document.getElementById('sellSubmitBtn');
  const message = document.getElementById('sellMessage');
  submitBtn.disabled = true;
  message.textContent = 'Posting your listing...';

  const title = document.getElementById('sellTitle').value.trim();
  const categoryId = document.getElementById('sellCategory').value;
  const price = document.getElementById('sellPrice').value;
  const description = document.getElementById('sellDescription').value.trim();

  if (!title || !categoryId || !price) {
    message.textContent = 'Please fill in title, category, and price.';
    submitBtn.disabled = false;
    return;
  }

  // Upload images first
  const imageUrls = [];
  for (const file of selectedFiles) {
    const path = `${session.user.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await sb.storage.from('listing-images').upload(path, file);

    if (uploadError) {
      message.textContent = `Image upload failed: ${uploadError.message}`;
      submitBtn.disabled = false;
      return;
    }

    const { data: { publicUrl } } = sb.storage.from('listing-images').getPublicUrl(path);
    imageUrls.push(publicUrl);
  }

  const { error } = await sb.from('listings').insert({
    seller_id: session.user.id,
    category_id: Number(categoryId),
    title,
    description,
    price: Number(price),
    images: imageUrls,
    status: 'active'
  });

  submitBtn.disabled = false;

  if (error) {
    message.textContent = error.message;
    return;
  }

  message.textContent = 'Listing posted! Redirecting...';
  setTimeout(() => window.location.href = 'listings.html', 1200);
});

document.addEventListener('DOMContentLoaded', loadCategories);