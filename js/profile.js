let currentProfile = null;
let currentSession = null;

function initialsFromName(name) {
  return name.trim().split(/\s+/).filter(Boolean)
    .slice(0, 2).map(p => p[0].toUpperCase()).join("") || "PS";
}

function showStatus(msg) {
  const el = document.getElementById('status-message');
  el.textContent = msg;
  setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 3000);
}

async function loadProfile() {
  const session = await requireAuth();
  if (!session) return;
  currentSession = session;

  const { data: profile, error } = await sb
    .from('profiles')
    .select('full_name, reg_no, hostel, email, avatar_url, banner_url')
    .eq('id', session.user.id)
    .single();

  if (error) { showStatus('Could not load profile.'); return; }
  currentProfile = profile;
  renderView();
}

function renderView() {
  const name = currentProfile.full_name || 'Unnamed student';
  document.getElementById('profile-name').textContent = name;
  document.getElementById('profile-email').textContent = currentProfile.email || currentSession.user.email;
  document.getElementById('reg-no-value').textContent = currentProfile.reg_no || '—';
  document.getElementById('hostel-value').textContent = currentProfile.hostel || '—';

  const avatar = document.querySelector('.profile-avatar');
  if (currentProfile.avatar_url) {
    document.getElementById('profile-avatar-image').src = currentProfile.avatar_url;
    avatar.classList.add('has-image');
  } else {
    document.getElementById('profile-initials').textContent = initialsFromName(name);
    avatar.classList.remove('has-image');
  }

  const banner = document.getElementById('profile-banner');
  if (currentProfile.banner_url) {
    document.getElementById('profile-banner-image').src = currentProfile.banner_url;
    banner.classList.add('has-image');
  } else {
    banner.classList.remove('has-image');
  }
}

function openEdit() {
  document.getElementById('name-input').value = currentProfile.full_name || '';
  document.getElementById('hostel-input').value = currentProfile.hostel || '';
  document.getElementById('profile-card').classList.add('is-editing');
}

function closeEdit() {
  document.getElementById('profile-card').classList.remove('is-editing');
}

async function saveProfile(event) {
  event.preventDefault();
  const fullName = document.getElementById('name-input').value.trim();
  const hostel = document.getElementById('hostel-input').value.trim();
  if (!fullName || !hostel) { showStatus('Add your name and hostel/block before saving.'); return; }

  const { error } = await sb.from('profiles')
    .update({ full_name: fullName, hostel })
    .eq('id', currentSession.user.id);

  if (error) { showStatus(error.message); return; }

  currentProfile.full_name = fullName;
  currentProfile.hostel = hostel;
  renderView();
  closeEdit();
  showStatus('Profile details saved.');
}

// Real upload to Supabase Storage, replacing FileReader-only preview
async function uploadImage(file, column) {
  if (!file || !file.type.startsWith('image/')) { showStatus('Please choose an image file.'); return; }

  const path = `${currentSession.user.id}/${column}_${Date.now()}_${file.name}`;
  const { error: uploadError } = await sb.storage.from('profile-images').upload(path, file, { upsert: true });
  if (uploadError) { showStatus(uploadError.message); return; }

  const { data: { publicUrl } } = sb.storage.from('profile-images').getPublicUrl(path);

  const { error: updateError } = await sb.from('profiles')
    .update({ [column]: publicUrl })
    .eq('id', currentSession.user.id);

  if (updateError) { showStatus(updateError.message); return; }

  currentProfile[column] = publicUrl;
  renderView();
  showStatus(column === 'avatar_url' ? 'Profile photo updated.' : 'Banner updated.');
}

document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  document.getElementById('edit-profile-button').addEventListener('click', openEdit);
  document.getElementById('cancel-edit-button').addEventListener('click', closeEdit);
  document.getElementById('profile-edit-form').addEventListener('submit', saveProfile);
  document.getElementById('avatar-upload').addEventListener('change', e => uploadImage(e.target.files[0], 'avatar_url'));
  document.getElementById('banner-upload').addEventListener('change', e => uploadImage(e.target.files[0], 'banner_url'));
});