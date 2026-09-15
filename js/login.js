const authTabs = document.querySelectorAll("[data-auth-mode]");
const authForms = {
  login: document.getElementById("loginForm"),
  signup: document.getElementById("signupForm")
};
const authMessage = document.getElementById("authMessage");

function setAuthMode(mode) {
  authTabs.forEach((tab) => {
    const isActive = tab.dataset.authMode === mode;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  Object.entries(authForms).forEach(([key, form]) => {
    form.classList.toggle("active", key === mode);
  });

  authMessage.textContent = "";
}

authTabs.forEach((tab) => {
  tab.addEventListener("click", () => setAuthMode(tab.dataset.authMode));
});

authForms.login.addEventListener("submit", (event) => {
  event.preventDefault();
  const identifier = document.getElementById("loginIdentifier").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!identifier) {
    authMessage.textContent = "Enter your LPU email or registration number.";
    return;
  }
  logIn(identifier, password);
});

authForms.signup.addEventListener("submit", (event) => {
  event.preventDefault();
  handleSignup();
});

// forgot password
document.getElementById('forgotPasswordLink').addEventListener('click', (event) => {
  event.preventDefault();
  const email = prompt('Enter your LPU email to receive a reset link:');
  if (email) requestPasswordReset(email);
});