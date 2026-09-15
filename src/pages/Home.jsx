import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ListingCard from '../components/cards/ListingCard';
import TeamCard from '../components/cards/TeamCard';
import CategoryCard from '../components/cards/CategoryCard';

const colors = ["#f7d59a", "#f4b8c0", "#c9b5e8", "#c9dfbd", "#f1b986", "#bda7e6", "#dcd5fa", "#cfeee8"];

const heroProducts = [
  { name: "Books", src: "assets/books.svg", label: "BOOKS" },
  { name: "Headphones", src: "assets/headphones.svg", label: "AUDIO" },
  { name: "Bicycle", src: "assets/bicycle.svg", label: "CYCLE" },
  { name: "Backpack", src: "assets/backpack.svg", label: "BAG" },
  { name: "Watch", src: "assets/watch.svg", label: "WATCH" },
  { name: "Desk lamp", src: "assets/lamp.svg", label: "LAMP" }
];

const marketItems = [
  { name: "Headphones", src: "assets/headphones.svg", price: "Rs.1,200" },
  { name: "Bicycle", src: "assets/bicycle.svg", price: "Rs.2,800" },
  { name: "Table fan", src: "assets/fan.svg", price: "Rs.500" },
  { name: "Backpack", src: "assets/backpack.svg", price: "Rs.500" },
  { name: "Single bed", src: "assets/bed.svg", price: "Rs.3,000" },
  { name: "Bucket", src: "assets/bucket.svg", price: "Rs.3,000" },
  { name: "Shoes", src: "assets/shoes.svg", price: "Rs.700" },
  { name: "Desk lamp", src: "assets/lamp.svg", price: "Rs.350" }
];

const marketplaceSnapshot = {
  livePills: ["42 online", "Just listed", "2 chats active"],
  soldHighlight: "Sold in 3 hrs",
  stats: [
    { value: "1,200+", label: "Listings live" },
    { value: "87+", label: "Sold today" },
    { value: "42", label: "Online now" },
    { value: "94%", label: "Happy students" }
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
  { name: "Hostel Essentials", description: "Comfort, convenience and everything in between.", label: "HOSTEL", size: "large" },
  { name: "Study Zone", description: "Books, gear and tools for better learning.", label: "STUDY", size: "large" },
  { name: "Electronics & Appliances", description: "Smart tech, better living.", label: "TECH", size: "" },
  { name: "Sports Gear", description: "Play hard, stay active.", label: "SPORT", size: "" },
  { name: "Ride & Transport", description: "Bikes, rides and campus travel.", label: "RIDE", size: "" },
  { name: "Everything Else", description: "Random finds, real value.", label: "MORE", size: "" }
];

const initialListings = [
  { id: "1", title: "Sony Headphones", price: "Rs.899", location: "BH-3, Room 115", status: "Just listed", image: "assets/headphones.svg", label: "AUDIO" },
  { id: "2", title: "Mini Fridge", price: "Rs.4,500", location: "BH-1, Room 102", status: "Sold fast", image: "assets/fridge.svg", label: "FRIDGE" },
  { id: "3", title: "Study Lamp", price: "Rs.350", location: "BH-2, Room 204", status: "Just listed", image: "assets/lamp.svg", label: "LAMP" },
  { id: "4", title: "Nike Air Force 1", price: "Rs.1,799", location: "BH-4, Room 305", status: "Hot deal", image: "assets/nike-shoes.svg", label: "SHOES" },
  { id: "5", title: "Backpack", price: "Rs.499", location: "Girls Hostel, G-2", status: "New today", image: "assets/backpack-black.svg", label: "BAG" },
  { id: "6", title: "Badminton Set", price: "Rs.250", location: "BH-1, Sports Room", status: "Just listed", image: "assets/badminton.svg", label: "SPORT" },
  { id: "7", title: "Office Chair", price: "Rs.2,200", location: "BH-2, Room 210", status: "Just listed", image: "assets/chair.svg", label: "CHAIR" },
  { id: "8", title: "Induction Cooktop", price: "Rs.1,199", location: "BH-3, Room 118", status: "Hot deal", image: "assets/induction.svg", label: "COOK" },
  { id: "9", title: "Suitcase", price: "Rs.1,299", location: "BH-1, Room 103", status: "Sold fast", image: "assets/suitcase.svg", label: "CASE" },
  { id: "10", title: "Extension Board", price: "Rs.199", location: "BH-4, Room 302", status: "Just listed", image: "assets/extension-board.svg", label: "POWER" },
  { id: "11", title: "Dumbbells 10kg", price: "Rs.899", location: "Gym, BH-1", status: "New today", image: "assets/dumbbells.svg", label: "GYM" },
  { id: "12", title: "Water Bottle", price: "Rs.150", location: "Girls Hostel, G-1", status: "Just listed", image: "assets/bottle.svg", label: "BOTTLE" }
];

const team = [
  { name: "Subash Bhatta", role: "Co-founder", avatar: "assets/subash.png", initials: "SB", color: "#f7d9bc" },
  { name: "Arpit Shah", role: "Co-founder", avatar: "assets/arpit.jpeg", initials: "AS", color: "#efc3e4" },
  { name: "Anuj Pratap Singh", role: "Co-founder", avatar: "assets/anuj.jpg", initials: "AP", color: "#d5c2ee" },
  { name: "Maybe You", role: "We're hiring builders, designers, and campus hustlers.", avatar: null, initials: "+", color: "#bfeac2" }
];

const sellSteps = [
  {
    id: 1,
    kicker: "Step 1 of 4",
    title: "Snap & list",
    lead: "Take a photo. Add price.<br />Done in seconds.",
    muted: "No forms. No waiting.",
    link: "Next step ->",
    visual: (
      <div className="phone-scene">
        <div className="phone">
          <div className="phone-top">Create Listing</div>
          <div className="phone-photo">LAMP</div>
          <label>Title</label><div className="phone-field">Study Lamp</div>
          <label>Price</label><div className="phone-field accent">Rs.350</div>
          <button type="button">Post Listing -&gt;</button>
        </div>
        <span className="burst-badge">Posted</span>
      </div>
    )
  },
  {
    id: 2,
    kicker: "Step 2 of 4",
    title: "Get real<br />buyers",
    lead: "Only LPU students.<br />No random people.",
    muted: "Verified campus community you can trust.",
    link: "Next step ->",
    purple: true,
    visual: (
      <div className="buyer-board">
        <div className="note-card">Your campus.<br />Your people.</div>
        <div className="buyer-list-card">
          <strong>Buyers nearby</strong>
          <span>Rohan B. - LPU Verified</span>
          <span>Aanya S. - LPU Verified</span>
          <span>Karan M. - LPU Verified</span>
        </div>
      </div>
    )
  },
  {
    id: 3,
    kicker: "Step 3 of 4",
    title: "Chat & fix<br />price",
    lead: "Talk directly. No middleman.<br />You decide.",
    muted: "Clear chats. Fair deals. All on-campus.",
    link: "Next step ->",
    visual: (
      <div className="chat-phone">
        <div className="chat-head">Karan M. - Online</div>
        <p className="bubble left">Is this backpack still available?</p>
        <p className="bubble right">Yes, it is. Almost new.</p>
        <p className="bubble left">Can you do Rs.450?</p>
        <p className="bubble right">Sure, Rs.450 works.</p>
      </div>
    )
  },
  {
    id: 4,
    kicker: "Step 4 of 4",
    title: "Meet &<br />exchange",
    lead: "Meet at a safe campus spot.<br />Check the item. Make the swap.",
    muted: "No delivery. No strangers.",
    link: "Let's swap ->",
    purple: true,
    visual: (
      <div className="exchange-card">
        <span className="location-chip">Uni Mall - Meet here</span>
        <strong>Swap complete</strong>
        <p>Backpack sold for Rs.499</p>
        <button type="button">Leave a review</button>
      </div>
    )
  }
];

export default function Home() {
  const [activeStep, setActiveStep] = useState(1);
  const currentStep = sellSteps.find(s => s.id === activeStep) || sellSteps[0];

  return (
    <main>
      {/* Hero Section */}
      <section className="hero section-pad" id="home">
        <div className="dot-pattern"></div>
        <div className="hero-inner">
          <p className="brand">PASH.IT</p>
          <h1 className="headline">
            Trade anything. Save money.<br />
            Sell anything. <span>Get paid.</span>
          </h1>
          <div className="actions">
            <Link className="btn btn-primary" to="/sell">
              Sell <strong>-&gt;</strong>
            </Link>
            <Link className="btn" to="/listings">
              Find <strong>-&gt;</strong>
            </Link>
          </div>
          <div className="products" id="heroProducts" aria-label="Popular product types">
            {heroProducts.map((p, idx) => (
              <article key={p.name} className="product-card" aria-label={p.name}>
                <img src={p.src} alt={p.name} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Market Section */}
      <section className="market-section section-pad" id="market">
        <div className="market-inner">
          <div className="section-title-wrap">
            <div className="live-burst">LIVE</div>
            <h2 className="market-title">
              We built the market.<br />
              They traded everything.
            </h2>
          </div>

          <div className="live-pills" id="livePills">
            {marketplaceSnapshot.livePills.map(label => (
              <span key={label} className="live-pill">{label}</span>
            ))}
          </div>

          <div className="market-track" id="marketTrack">
            {marketItems.map((item, idx) => (
              <article key={item.name + idx} className="market-item" aria-label={item.name}>
                <img src={item.src} alt={item.name} />
                <span className="market-price">{item.price}</span>
              </article>
            ))}

            {marketplaceSnapshot.recentProducts.map(act => (
              <div
                key={act.student}
                className={`activity-card ${act.position}`}
                data-recent-product={act.product}
              >
                <img src={act.avatar} alt={act.student} />
                <p>
                  <strong>{act.student}{act.meta ? ` (${act.meta})` : ""}</strong>
                  <br />
                  {act.action} {act.product}
                </p>
              </div>
            ))}
          </div>

          <div className="sold-pill" id="soldPill">{marketplaceSnapshot.soldHighlight}</div>

          <div className="stats-panel" id="statsPanel">
            {marketplaceSnapshot.stats.map(s => (
              <article key={s.label} className="stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="category-section section-pad" id="categories">
        <div className="category-inner">
          <div className="category-title-wrap">
            <h2 className="category-title">Shop by Category</h2>
            <p className="category-subtitle">Everything you need, from people you trust.</p>
          </div>
          <div className="category-grid" id="categoryGrid">
            {categories.map((cat, idx) => (
              <CategoryCard
                key={cat.name}
                name={cat.name}
                description={cat.description}
                label={cat.label}
                size={cat.size}
                index={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="listings-section section-pad" id="latest-listings">
        <div className="listings-inner">
          <header className="listings-header">
            <div>
              <h2 className="listings-title">Latest Listings</h2>
              <span className="new-items-pill">48 new items today</span>
            </div>
            <div className="listings-actions">
              <Link className="view-all" to="/listings">View all -&gt;</Link>
            </div>
          </header>
          <div className="listings-grid" id="listingsGrid">
            {initialListings.map((item, idx) => (
              <ListingCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                location={item.location}
                status={item.status}
                image={item.image}
                label={item.label}
                index={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Selling Steps */}
      <section className="sell-step-section step-section section-pad" id="sell-step-one">
        <article className="step-card">
          <div className="step-tabs" role="tablist" aria-label="Selling steps">
            {[1, 2, 3, 4].map(num => (
              <button
                key={num}
                className={activeStep === num ? 'active' : ''}
                type="button"
                role="tab"
                aria-selected={activeStep === num}
                onClick={() => setActiveStep(num)}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="step-content">
            <div className="step-copy">
              <p className={`step-kicker ${currentStep.purple ? 'purple' : ''}`}>
                {currentStep.kicker}
              </p>
              <h2
                className="step-title"
                dangerouslySetInnerHTML={{ __html: currentStep.title }}
              />
              <p
                className="step-lead"
                dangerouslySetInnerHTML={{ __html: currentStep.lead }}
              />
              <p className="step-muted">{currentStep.muted}</p>
              <button
                className="step-link"
                type="button"
                onClick={() => setActiveStep(activeStep === 4 ? 1 : activeStep + 1)}
              >
                {currentStep.link}
              </button>
            </div>
          </div>

          <div className="step-visual-shell">{currentStep.visual}</div>
        </article>
      </section>

      {/* About Us */}
      <section className="about-section section-pad" id="about">
        <div className="about-inner">
          <div className="about-badge">About us</div>
          <p className="about-copy">
            Pash.it started in a hostel room with late nights, too many tabs, and one simple
            thought: why is buying and selling on campus still so hard? Today, we're building the
            easiest, safest, and most trusted student marketplace. By students, for students.
          </p>
          <div className="team-grid" id="teamGrid">
            {team.map(member => (
              <TeamCard
                key={member.name}
                name={member.name}
                role={member.role}
                avatar={member.avatar}
                initials={member.initials}
                color={member.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section section-pad" id="faq">
        <div className="faq-inner">
          <div className="faq-title-wrap">
            <h2 className="faq-title">You ask,<br />we answer.</h2>
            <span className="faq-burst">FAQs</span>
          </div>
          <div className="faq-list">
            <details open>
              <summary>Is this only for LPU students?</summary>
              <p>Yes. Pash.it is only for LPU students. Every user is verified.</p>
            </details>
            <details>
              <summary>How do I trust the seller?</summary>
              <p>Chat first, check the item, and meet at a safe campus spot.</p>
            </details>
            <details>
              <summary>Where do we meet for exchange?</summary>
              <p>Meet at familiar campus locations like Uni Mall, hostels, academic blocks, or other public campus spots.</p>
            </details>
            <details>
              <summary>How fast can I sell something?</summary>
              <p>Useful student items can get interest quickly with clear photos, fair pricing, and honest details.</p>
            </details>
            <details>
              <summary>Is there any delivery or middleman?</summary>
              <p>No middleman and no forced delivery. Buyers and sellers chat directly.</p>
            </details>
            <details>
              <summary>What if something goes wrong?</summary>
              <p>Keep communication inside Pash.it, meet safely, and report any issue.</p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}
