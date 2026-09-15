# PASH.IT - Campus Marketplace (React + Vite + Supabase)

PASH.IT is a modern student-to-student campus marketplace built with **React (Vite)**, **React Router**, and **Supabase**.

## Tech Stack
- **Frontend**: React 19, Vite 6, React Router 7, Lucide Icons
- **Backend & Auth**: Supabase (PostgreSQL, Realtime, Storage, Auth)
- **Styling**: Responsive custom design system with candy pastel themes and Anton/Inter typography

---

## Getting Started

### 1. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Build for Production
```bash
npm run build
```

---

## Project Structure
```text
├── public/
│   └── assets/              # Vector illustrations & team profile photos
├── src/
│   ├── components/
│   │   ├── cards/           # ListingCard, TeamCard, CategoryCard
│   │   └── layout/          # Navbar, Footer
│   ├── context/             # AuthContext, WishlistContext (Supabase)
│   ├── lib/                 # supabase.js client config
│   ├── pages/               # Home, Listings, Sell, Wishlist, Profile, Login, ResetPassword
│   ├── App.jsx              # Router & global provider layout
│   ├── main.jsx             # React entrypoint
│   └── index.css            # Consolidated styles
├── vite.config.js
└── package.json
```
