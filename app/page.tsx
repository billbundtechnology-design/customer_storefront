"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { demoApi } from "@/lib/demo-api";
import { catalog as seedCatalog, formatNaira, Listing, ListingKind } from "@/lib/catalog";

const categories = [
  { label: "Everything", value: "all", icon: "✳" },
  { label: "Event rentals", value: "rental", icon: "♧" },
  { label: "Venues", value: "venue", icon: "⌂" },
  { label: "Planning", value: "planning", icon: "✿" }
];

const itemGradients: Record<string, string> = {
  chairs: "visual-chairs",
  tables: "visual-tables",
  sound: "visual-sound",
  canopy: "visual-canopy",
  lounge: "visual-lounge",
  lights: "visual-lights",
  linen: "visual-linen",
  dance: "visual-dance",
  courtyard: "visual-courtyard",
  nook: "visual-nook",
  oak: "visual-oak",
  planning: "visual-planning"
};

function ListingVisual({ listing, large = false }: { listing: Listing; large?: boolean }) {
  return <div className={`listing-visual ${itemGradients[listing.visual]} ${large ? "large" : ""}`}>
    <span className="visual-stamp">{listing.kind === "venue" ? "A PLACE TO GATHER" : listing.kind === "planning" ? "MADE TO FEEL LIKE YOU" : "THE HSEVENTS EDIT"}</span>
    <div className={`visual-art art-${listing.visual}`} aria-hidden="true">
      {listing.visual === "chairs" && <><i /><i /><i /><i /></>}
      {listing.visual === "tables" && <><i /><i /><i /></>}
      {listing.visual === "sound" && <><i /><i /><i /></>}
      {listing.visual === "canopy" && <><i /><i /></>}
      {listing.visual === "lounge" && <><i /><i /></>}
      {listing.visual === "lights" && <><i /><i /><i /><i /></>}
      {listing.visual === "linen" && <><i /><i /></>}
      {listing.visual === "dance" && <><i /><i /><i /></>}
      {listing.visual === "courtyard" && <><i /><i /><i /></>}
      {listing.visual === "nook" && <><i /><i /></>}
      {listing.visual === "oak" && <><i /><i /><i /></>}
      {listing.visual === "planning" && <><i /><i /><i /></>}
    </div>
    <span className="visual-caption">{listing.category}</span>
  </div>;
}

function BagIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 8h14l1 13H4L5 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
}

export default function Storefront() {
  const [listings, setListings] = useState<Listing[]>(seedCatalog);
  const [kind, setKind] = useState<ListingKind | "all">("all");
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [bag, setBag] = useState<Record<string, number>>({});
  const [bagOpen, setBagOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryEvent, setEnquiryEvent] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    demoApi.get<Listing[]>("/catalog")
      .then((response) => setListings(response.data))
      .catch(() => setLoadError("The demo catalogue could not be loaded."));
  }, []);

  const visibleListings = useMemo(() => listings.filter((listing) => {
    const matchesKind = kind === "all" || listing.kind === kind;
    const matchesSearch = `${listing.name} ${listing.category} ${listing.description}`.toLowerCase().includes(search.trim().toLowerCase());
    const capacity = listing.capacity ?? 0;
    const matchesGuests = listing.kind !== "venue" || !guestCount ||
      (guestCount === "Under 30" && capacity < 30) ||
      (guestCount === "30–60 guests" && capacity >= 30 && capacity <= 60) ||
      (guestCount === "60–100 guests" && capacity >= 60 && capacity <= 100) ||
      (guestCount === "100+ guests" && capacity >= 100);
    return matchesKind && matchesSearch && matchesGuests;
  }), [guestCount, kind, listings, search]);

  const bagLines = listings.filter((listing) => bag[listing.id] > 0);
  const bagCount = Object.values(bag).reduce((sum, quantity) => sum + quantity, 0);
  const bagSubtotal = bagLines.reduce((sum, listing) => sum + listing.price * bag[listing.id], 0);

  function announce(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }

  function addToBag(listing: Listing) {
    setBag((current) => ({ ...current, [listing.id]: (current[listing.id] ?? 0) + 1 }));
    announce(`${listing.name} added to your bag.`);
  }

  function changeQuantity(listingId: string, change: number) {
    setBag((current) => {
      const quantity = Math.max(0, (current[listingId] ?? 0) + change);
      const updated = { ...current };
      if (quantity) updated[listingId] = quantity;
      else delete updated[listingId];
      return updated;
    });
  }

  function browse(kindFilter: ListingKind | "all") {
    setKind(kindFilter);
    setShowAll(kindFilter === "all");
    if (kindFilter === "all") setGuestCount("");
    setMobileOpen(false);
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    browse(kind);
  }

  function handleEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const details = new FormData(event.currentTarget);
    setEnquiryName(String(details.get("name") ?? ""));
    setEnquiryEvent(String(details.get("event") ?? ""));
    setSubmitted(true);
  }

  const featured = kind === "all" && !search.trim() && !showAll
    ? visibleListings.filter((item) => item.popular)
    : visibleListings;

  return <main>
    <div className="announcement"><span>Thoughtful celebrations start here.</span><a className="announcement-right" href="#contact">Planning something in Lagos? Let’s talk <i>↗</i></a></div>
    <header className="site-header">
      <a className="wordmark" href="#" aria-label="HSEvents home"><Image className="wordmark-logo" src="/logo.jpeg" alt="" width={48} height={48} priority /><span>HSEvents<small>EVENTS & RENTALS</small></span></a>
      <button className="mobile-nav-toggle" aria-label="Toggle menu" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? "×" : "☰"}</button>
      <nav className={`customer-nav ${mobileOpen ? "open" : ""}`} aria-label="Customer navigation">
        <button onClick={() => browse("rental")}>Rentals</button>
        <button onClick={() => browse("venue")}>Our spaces</button>
        <button onClick={() => browse("planning")}>Event planning</button>
        <a href="#how-it-works" onClick={() => setMobileOpen(false)}>How it works</a>
      </nav>
      <div className="header-actions"><a className="contact-link" href="#contact">Let’s talk <span>↗</span></a><button className="bag-button" onClick={() => setBagOpen(true)} aria-label={`Open bag, ${bagCount} items`}><BagIcon />{bagCount > 0 && <i>{bagCount}</i>}</button></div>
    </header>

    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><span /> RENTALS · VENUES · EVENT PLANNING</div>
        <h1>Your event,<br /><em>beautifully</em><br />sorted.</h1>
        <p>From the chairs and tables to the perfect space and finishing touches, find what you need for your celebration in Lagos.</p>
        <div className="hero-links"><button onClick={() => browse("rental")}>Browse event rentals <span>↗</span></button><button className="hero-secondary" onClick={() => { setBookingOpen(true); setSubmitted(false); }}>Plan an event with us</button></div>
        <div className="hero-highlights"><span><i>01</i> Prices in Nigerian naira</span><span><i>02</i> Availability confirmed with you</span></div>
      </div>
      <div className="hero-art">
        <Image className="hero-photo" src="/event-hero.jpg" alt="An elegant celebration hall set with round tables and gold chairs" fill priority sizes="(max-width: 720px) 100vw, 50vw" />
        <div className="hero-image-label"><span>THE DETAILS MAKE THE DAY</span><span>Let’s bring yours together <i>↗</i></span></div>
      </div>
      <form className="discovery-bar" onSubmit={handleSearch}>
        <label className="discovery-field"><span className="discovery-icon">✳</span><span><small>WHAT ARE YOU PLANNING?</small><select value={kind} onChange={(event) => setKind(event.target.value as ListingKind | "all")}><option value="all">A little bit of everything</option><option value="rental">Rentals for my event</option><option value="venue">A lovely event space</option><option value="planning">Help planning my event</option></select></span></label>
        <label className="discovery-field"><span className="discovery-icon">▦</span><span><small>WHEN IS THE BIG DAY?</small><input aria-label="Event date" type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} /></span></label>
        <label className="discovery-field guests-field"><span className="discovery-icon">♙</span><span><small>HOW MANY LOVELY PEOPLE?</small><select aria-label="Guest count" value={guestCount} onChange={(event) => setGuestCount(event.target.value)}><option value="">Any number of guests</option><option>Under 30</option><option>30–60 guests</option><option>60–100 guests</option><option>100+ guests</option></select></span></label>
        <button className="discover-button" type="submit">Find your thing <span>↗</span></button>
      </form>
      <div className="hero-edge-note">THE HSEVENTS WAY <span>—</span> EASY DOES IT</div>
    </section>

    <div className="trust-strip"><span>Event rentals, venues & planning in one place</span><i>✳</i><span>Clear starting prices in NGN</span><i>✳</i><span>Enquire first, confirm availability with our team</span></div>

    <section className="collection-section page-section" id="collection">
      <div className="section-topline"><span className="eyebrow"><span /> A GOOD PLACE TO BEGIN</span><span className="section-index">01 — THE COLLECTION</span></div>
      <div className="section-heading"><div><h2>Build your<br /><em>celebration.</em></h2></div><p>Explore event essentials, find a space, or add planning support. Prices are shown up front; add your favourites to a shortlist and ask us to confirm the details.</p></div>
      <div className="category-tabs" role="tablist" aria-label="Browse by category">
        {categories.map((category) => <button key={category.value} role="tab" aria-selected={kind === category.value} className={kind === category.value ? "selected" : ""} onClick={() => { setKind(category.value as ListingKind | "all"); setShowAll(category.value === "all"); if (category.value === "all") setGuestCount(""); }}><span>{category.icon}</span>{category.label}</button>)}
        <label className="collection-search"><span>⌕</span><input placeholder="Find something..." aria-label="Search catalogue" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
      </div>
      {loadError && <div className="catalog-error" role="alert">{loadError}</div>}
      <div className="product-grid">
        {featured.map((listing) => <article className="product-card" key={listing.id}>
          <ListingVisual listing={listing} />
          <div className="product-details"><div className="product-title-row"><div><span className="product-category">{listing.category}</span><h3>{listing.name}</h3></div><button className={`heart-button ${bag[listing.id] ? "saved" : ""}`} aria-label={`Add ${listing.name} to bag`} onClick={() => addToBag(listing)}>＋</button></div><div className="product-foot"><span><b>{formatNaira(listing.price)}</b><small> / {listing.unit}</small></span><button onClick={() => addToBag(listing)}>Add to bag <span>↗</span></button></div></div>
        </article>)}
      </div>
      {featured.length === 0 && <div className="no-results"><span>✳</span><b>Nothing here just yet.</b><small>Try another search or explore everything we’ve gathered.</small><button onClick={() => { setSearch(""); setKind("all"); setGuestCount(""); setShowAll(true); }}>See the full collection</button></div>}
      <div className="collection-bottom"><span>Little details. Big feeling. That’s the idea.</span><button onClick={() => { setKind("all"); setSearch(""); setGuestCount(""); setShowAll(true); }}>{showAll ? "You’re seeing the full collection" : "View everything"} <span>↗</span></button></div>
    </section>

    <section className="spaces-section page-section" id="spaces">
      <div className="spaces-intro"><span className="eyebrow light"><span /> VENUES FOR YOUR OCCASION</span><h2>Find your<br /><em>place to gather.</em></h2><p>Compare venue styles, guest capacities and starting prices. Tell us your date and we’ll help check what’s available.</p><button onClick={() => browse("venue")}>Explore venues <span>↗</span></button><span className="spaces-mark">HSEVENTS / SPACES</span></div>
      <div className="spaces-cards">{listings.filter((item) => item.kind === "venue").slice(0, 2).map((listing, index) => <article className="space-card" key={listing.id}><ListingVisual listing={listing} large /><div className="space-card-details"><div><span>{listing.category} · {index === 0 ? "Up to 80 guests" : "Up to 35 guests"}</span><h3>{listing.name}</h3></div><button aria-label={`Add ${listing.name} to bag`} onClick={() => addToBag(listing)}>↗</button><p>{listing.description}</p><b>{formatNaira(listing.price)} <small>/ {listing.unit}</small></b></div></article>)}</div>
    </section>

    <section className="planning-section page-section">
      <div className="planning-art">
        <div className="planning-sun" /><div className="planning-vase"><i /><i /><i /></div><span>AN EXTRA PAIR OF HANDS</span>
      </div>
      <div className="planning-copy"><div className="section-topline"><span className="eyebrow"><span /> WHEN YOU WANT A LITTLE HELP</span><span className="section-index">02 — EVENT PLANNING</span></div><h2>Less to juggle.<br /><em>More to remember.</em></h2><p>Some days deserve an extra pair of hands. Tell us what you’re dreaming up and we’ll help you bring the moving parts together — with care, and without making it complicated.</p><button onClick={() => { setKind("planning"); document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }); }}>Meet your planning crew <span>↗</span></button><div className="planning-points"><span><i>01</i> Thoughtful from first chat</span><span><i>02</i> Your day, your way</span><span><i>03</i> No silly questions</span></div></div>
    </section>

    <section className="how-section page-section" id="how-it-works">
      <div className="section-topline"><span className="eyebrow"><span /> NICE AND SIMPLE</span><span className="section-index">03 — HOW IT WORKS</span></div>
      <div className="how-heading"><h2>From shortlist<br /><em>to celebration.</em></h2><p>Start with what you need. Our team can confirm availability and help you plan the next steps.</p></div>
      <div className="steps-grid"><article><span className="step-num">01</span><span className="step-icon">⌕</span><h3>Browse & shortlist</h3><p>Choose rentals, spaces or planning support and add items to your bag.</p></article><article><span className="step-num">02</span><span className="step-icon">✳</span><h3>Share your event details</h3><p>Tell us the date, location and guest count so we can understand your requirements.</p></article><article><span className="step-num">03</span><span className="step-icon">♡</span><h3>Confirm with our team</h3><p>We’ll discuss availability, delivery and your quote before anything is booked.</p></article></div>
    </section>

    <section className="closing-section" id="contact"><div className="closing-flower">✳</div><span className="eyebrow light">A GOOD DAY, IN THE MAKING</span><h2>So, what are we<br /><em>celebrating?</em></h2><p>Big wedding, tiny dinner, or something in between. We’d love to hear about it.</p><button onClick={() => { setBookingOpen(true); setSubmitted(false); }}>Tell us about your day <span>↗</span></button><span className="closing-note">A real person from HSEvents will be happy to help.</span></section>

    <footer className="site-footer"><a className="wordmark footer-wordmark" href="#" aria-label="HSEvents home"><Image className="wordmark-logo" src="/logo.jpeg" alt="" width={40} height={40} /><span>HSEvents<small>EVENTS & RENTALS</small></span></a><span className="footer-caption">For the days you’ll talk about for years.</span><div className="footer-right"><span>Lagos, Nigeria · WAT (UTC+1)</span><span>© 2026 HSEvents</span></div></footer>
    <div className="demo-disclaimer">DEMO STOREFRONT · Catalogue, prices and enquiries are illustrative only. No booking, message or payment is sent.</div>

    {toast && <div className="toast" role="status">✳ &nbsp;{toast}</div>}
    {bagOpen && <div className="scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setBagOpen(false); }}><aside className="bag-drawer" aria-label="Your bag"><div className="drawer-head"><div><span className="eyebrow"><span /> YOUR LITTLE LIST</span><h2>Your bag <small>({bagCount})</small></h2></div><button className="close-button" aria-label="Close bag" onClick={() => setBagOpen(false)}>×</button></div>
      {bagLines.length === 0 ? <div className="bag-empty"><span>♧</span><h3>A little room for something lovely.</h3><p>Your bag is empty for now. Browse the collection and add a few favourites.</p><button className="dark-button" onClick={() => { setBagOpen(false); browse("all"); }}>Explore the collection <span>↗</span></button></div> :
        <><div className="bag-lines">{bagLines.map((listing) => <div className="bag-line" key={listing.id}><div className="bag-mini-visual"><ListingVisual listing={listing} /></div><div className="bag-line-copy"><span>{listing.category}</span><b>{listing.name}</b><small>{formatNaira(listing.price)} / {listing.unit}</small><div className="quantity"><button aria-label={`Remove one ${listing.name}`} onClick={() => changeQuantity(listing.id, -1)}>−</button><span>{bag[listing.id]}</span><button aria-label={`Add one ${listing.name}`} onClick={() => changeQuantity(listing.id, 1)}>＋</button></div></div><b className="line-total">{formatNaira(listing.price * bag[listing.id])}</b></div>)}</div><div className="bag-summary"><div><span>Illustrative subtotal</span><b>{formatNaira(bagSubtotal)}</b></div><small>Final quote, availability and delivery are confirmed with the HSEvents team.</small><button className="dark-button" onClick={() => { setBagOpen(false); setBookingOpen(true); setSubmitted(false); }}>Ask about these items <span>↗</span></button></div></>}
    </aside></div>}

    {bookingOpen && <div className="scrim modal-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOpen(false); }}><section className="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-heading"><button className="close-button modal-close" aria-label="Close enquiry" onClick={() => setBookingOpen(false)}>×</button>{submitted ? <div className="success-state"><span>✳</span><div className="eyebrow"><span /> JUST BETWEEN US (DEMO)</div><h2>Your note is<br /><em>right here.</em></h2><p>{enquiryName ? `Thanks, ${enquiryName}. ` : ""}{enquiryEvent ? `Your ${enquiryEvent.toLowerCase()} enquiry ` : "Your enquiry "}is shown as a local demo preview only. Nothing has been sent, reserved, or charged. In the real HSEvents experience, our team would be in touch to chat through your day.</p><button className="dark-button" onClick={() => { setBookingOpen(false); setSubmitted(false); }}>Back to the good stuff <span>↗</span></button></div> :
        <><div className="eyebrow"><span /> LET’S START WITH A HELLO</div><h2 id="enquiry-heading">Tell us about<br /><em>your day.</em></h2><p className="modal-intro">A few details are plenty. We’ll keep it easy.</p><form className="enquiry-form" onSubmit={handleEnquiry}><label>Your name<input name="name" required placeholder="The name we should use" /></label><div className="form-pair"><label>Email address<input type="email" name="email" required placeholder="you@example.com" /></label><label>Phone number<input type="tel" name="phone" required placeholder="+234" /></label></div><div className="form-pair"><label>What are you planning?<select name="event" defaultValue=""><option value="" disabled>Choose one</option><option>Wedding or engagement</option><option>Birthday or anniversary</option><option>Intimate dinner</option><option>Corporate gathering</option><option>Something else</option></select></label><label>Event date<input type="date" name="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} /></label></div><label>A little more about it <span className="optional">(optional)</span><textarea name="notes" rows={3} placeholder="Guest count, rentals you liked, or anything on your mind..." defaultValue={bagLines.length ? `I'd love to ask about: ${bagLines.map((item) => `${bag[item.id]} × ${item.name}`).join(", ")}.` : ""} /></label><div className="demo-form-note">DEMO ONLY · Details stay in this page and are not sent anywhere.</div><button className="dark-button submit-button" type="submit">Save demo enquiry <span>↗</span></button></form></>}
    </section></div>}
  </main>;
}
