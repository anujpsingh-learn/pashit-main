//handlesSignup
async function handleSignup() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const regNo = document.getElementById('signupRegNo').value;
  const hostel = document.getElementById('signupHostel').value;
  const password = document.getElementById('signupPassword').value;

  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { full_name: name, reg_no: regNo, hostel } }
  });

  if (error) {
    document.getElementById('authMessage').textContent = error.message;
    return;
  }

  if (data.session) {
    // Email confirmation is off in your Supabase settings — logged in immediately
    window.location.href = 'index.html';
  } else {
    // Email confirmation is still ON — no session until they click the email link
    document.getElementById('authMessage').textContent =
      'Account created! Check your email to confirm, then log in.';
  }
}

// SIGNUP
async function signUp(email, password, fullName) {
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName } // used by the profiles trigger
    }
  });

  if (error) {
    alert(error.message);
    return;
  }
  window.location.href = 'index.html'; // or a "check your email" page
}

// LOGIN
async function logIn(identifier, password) {
  let email = identifier.trim();

  // If it doesn't look like an email, treat it as a reg. no. and look it up
  if (!email.includes('@')) {
    const { data: foundEmail, error: lookupError } = await sb
      .rpc('get_email_by_reg_no', { p_reg_no: email });

    if (lookupError || !foundEmail) {
      document.getElementById('authMessage').textContent =
        'No account found for that registration number.';
      return;
    }
    email = foundEmail;
  }

  const { data, error } = await sb.auth.signInWithPassword({ email, password });

  if (error) {
    document.getElementById('authMessage').textContent = error.message;
    return;
  }
  window.location.href = 'index.html';
}

// LOGOUT
async function logOut() {
  await sb.auth.signOut();
  window.location.href = 'login.html';
}

// PROTECT A PAGE (call at top of sell.html, profile.html etc.)
async function requireAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
  }
  return session;
}


// Swap "Login / Sign Up" for a profile avatar when logged in
async function updateAuthUI() {
  const authLink = document.getElementById('authLink');
  if (!authLink) return; // page has no header auth link (e.g. login.html itself)

  const { data: { session } } = await sb.auth.getSession();

  if (session) {
    const { data: profile } = await sb
      .from('profiles')
      .select('full_name')
      .eq('id', session.user.id)
      .single();

    const source = profile?.full_name || session.user.email;
    const initials = source
      .trim()
      .split(/\s+/)
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    authLink.outerHTML = `
      <a href="profile.html" id="authLink" title="${source}"
        style="display:inline-flex;align-items:center;justify-content:center;
                align-self:center;flex-shrink:0;
                width:36px;height:36px;min-width:36px;min-height:36px;
                border-radius:50%;background:#5c0a1f;
                color:#fff;font-weight:700;font-size:13px;text-decoration:none;">
        ${initials}
      </a>
    `;
  } else {
    authLink.outerHTML = `<a href="login.html" id="authLink">Login / Sign Up</a>`;
  }
}

document.addEventListener('DOMContentLoaded', updateAuthUI);

// forgot password
async function requestPasswordReset(email) {
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset-password.html'
  });

  if (error) {
    document.getElementById('authMessage').textContent = error.message;
    return;
  }
  document.getElementById('authMessage').textContent =
    'Check your email for a password reset link.';
}