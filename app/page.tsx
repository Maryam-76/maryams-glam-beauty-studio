"use client";

import { useState } from "react";

interface Product {
  id: number;
  name: string;
  category: "Lips & Cheeks" | "Eyes" | "Face & Base";
  price: number;
  pieces: string;
  rating: string;
  reviews: number;
  swatches: string[];
  image: string;
  description: string;
  highlights: string[];
}

interface CartItem extends Product {
  qty: number;
}

interface PaymentOption {
  id: string;
  label: string;
  tag: string;
  accountTitle: string;
  accountInfo: string;
  instructions: string;
}

const WHATSAPP_NUMBER = "923168242863";

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "jazzcash",
    label: "JazzCash Mobile Account",
    tag: "Instant Transfer",
    accountTitle: "Maryam",
    accountInfo: "0316-8242863",
    instructions: "Transfer exact order total via JazzCash App or *786# and share the TID screenshot on WhatsApp.",
  },
  {
    id: "easypaisa",
    label: "Easypaisa Mobile Wallet",
    tag: "Instant Transfer",
    accountTitle: "Maryam",
    accountInfo: "0316-8242863",
    instructions: "Send payment to Easypaisa Wallet 0316-8242863 and attach receipt on WhatsApp for priority dispatch.",
  },
  {
    id: "bank",
    label: "Raast ID / Bank Transfer (IBFT)",
    tag: "Zero Fee",
    accountTitle: "Maryam's Glam Studio",
    accountInfo: "Raast ID: 03168242863",
    instructions: "Pay free of charge from any Pakistani banking app (HBL, Meezan, UBL, Alfalah) via Raast ID.",
  },
  {
    id: "cod",
    label: "Cash on Delivery (COD)",
    tag: "Pay at Doorstep",
    accountTitle: "Nationwide Courier",
    accountInfo: "Leopards / TCS Express",
    instructions: "Pay cash in PKR when your sealed vanity parcel arrives at your doorstep (2–4 working days).",
  },
  {
    id: "card",
    label: "Visa / Mastercard Debit & Credit",
    tag: "Online Link",
    accountTitle: "3D-Secure Checkout",
    accountInfo: "PayFast / Bank Link",
    instructions: "Request a secure encrypted card payment link on WhatsApp after placing your bag order.",
  },
];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Velvet Matte Lipstick Trio Set",
    category: "Lips & Cheeks",
    price: 3800,
    pieces: "3 Full-Size Lipsticks",
    rating: "4.9",
    reviews: 128,
    swatches: ["#9E4747", "#7A1626", "#C98276"],
    image: "/images/lipstick-set.jpg",
    description: "Three plush, non-drying velvet matte lipsticks in Rosewood, Royal Crimson, and Soft Nude housed in weighted gold cases.",
    highlights: ["10-hour transfer-resistant wear", "Enriched with Vitamin E & Shea Butter", "Zero feathering or lip dryness"],
  },
  {
    id: 2,
    name: "Rose Quartz Cheek Blush & Luxury Brush Set",
    category: "Lips & Cheeks",
    price: 4500,
    pieces: "Blush Compact + Kabuki Brush",
    rating: "4.8",
    reviews: 94,
    swatches: ["#E89BAE", "#D87A90", "#F3B6C2"],
    image: "/images/blush-brush-set.jpg",
    description: "Finely milled petal-pink mineral blush paired with a rose-quartz handle fluffy blending brush for a seamless airbrushed flush.",
    highlights: ["Buildable silky satin sheen", "Ultra-soft cruelty-free synthetic bristles", "Engraved floral compact pan"],
  },
  {
    id: 3,
    name: "12-Shade Rose Gold & Bronze Eyeshadow Palette",
    category: "Eyes",
    price: 6200,
    pieces: "12 Pans + Full Mirror & Brush",
    rating: "5.0",
    reviews: 162,
    swatches: ["#E3B5A4", "#B87A56", "#8B4A3B", "#4A2C2A"],
    image: "/images/eyeshadow-palette.jpg",
    description: "Twelve buttery mattes and high-foil rose-gold shimmers curated for effortless daytime office looks and bridal evening glam.",
    highlights: ["Zero-fallout velvety pigment payoff", "Full-length vanity mirror included", "Dual-ended shader & crease brush"],
  },
  {
    id: 4,
    name: "Luminous Silk Liquid Foundation & Compact Duo",
    category: "Face & Base",
    price: 8500,
    pieces: "30ml Pump Bottle + Pressed Compact",
    rating: "4.9",
    reviews: 115,
    swatches: ["#E5C2A3", "#D4A882", "#BD8E66"],
    image: "/images/foundation-duo.jpg",
    description: "Weightless serum-infused liquid foundation paired with a micro-blurred setting compact designed for warm South Asian undertones.",
    highlights: ["Humidity-proof 12-hour coverage", "Flashback-free soft-focus finish", "Non-comedogenic & dermatologist tested"],
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("jazzcash");

  const categories = ["All", "Lips & Cheeks", "Eyes", "Face & Base"];
  const filteredProducts =
    selectedCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === selectedCategory);

  const addToBag = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setQuickViewProduct(null);
    setBagOpen(true);
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const activePayment = PAYMENT_OPTIONS.find((p) => p.id === selectedPayment) || PAYMENT_OPTIONS[0];

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const summary = cart
      .map((item, idx) => `${idx + 1}. ${item.name} (x${item.qty}) — Rs. ${(item.price * item.qty).toLocaleString()}`)
      .join("\n");
    const text = `Hello Maryam's Glam Beauty Studio!\nI'd like to confirm my beauty order:\n\n${summary}\n\nTotal Payable: Rs. ${subtotal.toLocaleString()}\nSelected Payment: ${activePayment.label}\n\nPlease share delivery confirmation.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Slim Editorial Top Ribbon */}
      <div className="bg-[#2D1418] text-[#F7DCE0] text-xs py-2.5 px-4 text-center tracking-wider uppercase">
        Complimentary Vanity Gift Box on Orders Above Rs. 6,000 • Order Line: 0316-8242863
      </div>

      {/* Centered Boutique Navigation */}
      <header className="sticky top-0 z-40 bg-[#FBF6F5]/90 backdrop-blur-md border-b border-[#EBD8D6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-widest text-[#6E3B43]">
            <a href="#collection" className="hover:text-[#2D1418] transition">Collection</a>
            <a href="#checkout-methods" className="hover:text-[#2D1418] transition">Payments</a>
            <a href="#market-report" className="hover:text-[#2D1418] transition">Market Report</a>
          </nav>

          <a href="#" className="text-center">
            <span style={{ fontFamily: "var(--font-serif)" }} className="text-xl sm:text-2xl font-bold tracking-tight text-[#2D1418] block">
              Maryam&apos;s Glam
            </span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#A85764] font-semibold block">
              Beauty Studio
            </span>
          </a>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-[#6E3B43] hover:text-[#2D1418]"
            >
              Consult
            </a>
            <button
              onClick={() => setBagOpen(true)}
              className="bg-[#2D1418] hover:bg-[#4A2228] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full flex items-center gap-2 transition"
            >
              <span>Beauty Bag</span>
              <span className="bg-[#E5989B] text-[#2D1418] w-5 h-5 rounded-full flex items-center justify-center text-[11px]">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Split-Screen Editorial Hero (Distinct Boutique Layout) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white border border-[#EBD8D6] px-3.5 py-1.5 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#C96A78]"></span>
              <span className="text-xs font-semibold text-[#6E3B43]">4.9★ Rated by 500+ Pakistani Beauty Lovers</span>
            </div>

            <h1
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-3xl sm:text-5xl font-bold text-[#2D1418] leading-[1.15]"
            >
              Velvet Pigments &amp; Rose-Gold Glow, Curated for You.
            </h1>

            <p className="text-sm sm:text-base text-[#5C3D42] leading-relaxed max-w-lg">
              Discover high-impact matte lip trios, luminous silk foundations, and 12-pan shimmer palettes crafted for South Asian skin tones. Delivered nationwide with JazzCash, Easypaisa, Raast &amp; COD.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#collection"
                className="bg-[#9E4756] hover:bg-[#823643] text-white text-sm font-bold px-7 py-3.5 rounded-full shadow-sm transition"
              >
                Explore the Sets
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "Assalam-o-Alaikum Maryam's Glam Beauty Studio! Help me choose my shade."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-[#F5E8E7] text-[#2D1418] border border-[#DFC5C3] text-sm font-bold px-6 py-3.5 rounded-full transition"
              >
                Shade Match on WhatsApp
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#EBD8D6] max-w-md">
              <div>
                <p style={{ fontFamily: "var(--font-serif)" }} className="text-xl font-bold text-[#2D1418]">100%</p>
                <p className="text-xs text-[#6E3B43]">Cruelty-Free</p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-serif)" }} className="text-xl font-bold text-[#2D1418]">12 Hr</p>
                <p className="text-xs text-[#6E3B43]">Humidity Lock</p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-serif)" }} className="text-xl font-bold text-[#2D1418]">2–4 Days</p>
                <p className="text-xs text-[#6E3B43]">PK Delivery</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-t-[140px] rounded-b-3xl overflow-hidden border-4 border-white shadow-xl aspect-[4/3]">
              <img
                src="/images/hero-banner.jpg"
                alt="Maryam's Glam Beauty Studio luxury vanity flat lay"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-5 -left-5 bg-white border border-[#EBD8D6] rounded-2xl p-4 shadow-lg max-w-[220px]">
              <p className="text-[11px] uppercase tracking-wider font-bold text-[#A85764]">Signature Bundle</p>
              <p className="text-sm font-bold text-[#2D1418] mt-0.5">Bridal &amp; Everyday Sets</p>
              <p className="text-xs text-[#6E3B43] mt-1">Starting from Rs. 3,800 with free gift wrapping.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filterable 2-Column Editorial Product Showcase */}
      <section id="collection" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A85764]">Curated Boutique</p>
            <h2 style={{ fontFamily: "var(--font-serif)" }} className="text-2xl sm:text-4xl font-bold text-[#2D1418] mt-1">
              Shop Signature Sets
            </h2>
          </div>

          {/* Interactive Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  selectedCategory === cat
                    ? "bg-[#2D1418] text-white"
                    : "bg-white text-[#6E3B43] border border-[#EBD8D6] hover:bg-[#F5E8E7]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Horizontal Cards with Shade Swatches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="bg-white rounded-3xl border border-[#EBD8D6] overflow-hidden shadow-xs hover:shadow-md transition flex flex-col sm:flex-row"
            >
              <div className="sm:w-2/5 relative bg-[#F7ECEB] aspect-[4/3] sm:aspect-auto overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/95 text-[#2D1418] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  ★ {product.rating} ({product.reviews})
                </span>
              </div>

              <div className="sm:w-3/5 p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A85764]">
                      {product.category}
                    </span>
                    <span className="text-[11px] text-[#6E3B43]">{product.pieces}</span>
                  </div>

                  <h3 style={{ fontFamily: "var(--font-serif)" }} className="text-lg font-bold text-[#2D1418] mt-1">
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#5C3D42] mt-2 leading-relaxed">{product.description}</p>

                  {/* Shade Swatch Dots */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[11px] font-semibold text-[#6E3B43]">Shades:</span>
                    {product.swatches.map((hex, i) => (
                      <span
                        key={i}
                        style={{ backgroundColor: hex }}
                        className="w-4 h-4 rounded-full border border-white shadow-xs ring-1 ring-[#DFC5C3]"
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#F4E7E6] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6E3B43] block">Set Price</span>
                    <span className="text-lg font-bold text-[#2D1418]">Rs. {product.price.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="text-xs font-bold text-[#6E3B43] hover:text-[#2D1418] px-3 py-2 rounded-full border border-[#EBD8D6] transition"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => addToBag(product)}
                      className="bg-[#9E4756] hover:bg-[#823643] text-white text-xs font-bold px-4 py-2.5 rounded-full transition"
                    >
                      + Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Payment Methods Tab Section */}
      <section id="checkout-methods" className="bg-white border-y border-[#EBD8D6] py-14 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A85764]">Flexible Pakistani Payments</p>
            <h2 style={{ fontFamily: "var(--font-serif)" }} className="text-2xl sm:text-3xl font-bold text-[#2D1418] mt-1">
              Pay Your Way Across Pakistan
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {PAYMENT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedPayment(opt.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition ${
                  selectedPayment === opt.id
                    ? "bg-[#9E4756] text-white shadow-xs"
                    : "bg-[#FBF6F5] text-[#5C3D42] border border-[#EBD8D6] hover:bg-[#F3E5E4]"
                }`}
              >
                {opt.label.split(" (")[0]}
              </button>
            ))}
          </div>

          <div className="bg-[#FBF6F5] border border-[#EBD8D6] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#9E4756]/15 text-[#9E4756] px-2.5 py-0.5 rounded-full">
                {activePayment.tag}
              </span>
              <h3 className="text-lg font-bold text-[#2D1418]">{activePayment.label}</h3>
              <p className="text-sm text-[#5C3D42]">{activePayment.instructions}</p>
            </div>

            <div className="bg-white border border-[#EBD8D6] rounded-2xl p-4 min-w-[230px] shrink-0">
              <p className="text-[11px] uppercase tracking-wider text-[#6E3B43]">Account / Channel</p>
              <p className="text-sm font-bold text-[#2D1418] mt-0.5">{activePayment.accountTitle}</p>
              <p className="text-sm font-bold text-[#9E4756] mt-0.5">{activePayment.accountInfo}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic E-Commerce Metrics & Google Keyword Planner Section */}
      <section id="market-report" className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A85764]">Venture Metrics &amp; SEO</p>
          <h2 style={{ fontFamily: "var(--font-serif)" }} className="text-2xl sm:text-3xl font-bold text-[#2D1418] mt-1">
            Business Valuation &amp; Keyword Demand
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-[#EBD8D6]">
            <p className="text-xs font-bold uppercase text-[#6E3B43]">Initial Stock Worth</p>
            <p style={{ fontFamily: "var(--font-serif)" }} className="text-3xl font-bold text-[#2D1418] mt-1">
              Rs. 352,000
            </p>
            <p className="text-xs text-[#5C3D42] mt-2">65 curated makeup sets across 4 SKUs (~46% gross margin).</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#EBD8D6]">
            <p className="text-xs font-bold uppercase text-[#6E3B43]">Expected Monthly Revenue</p>
            <p style={{ fontFamily: "var(--font-serif)" }} className="text-3xl font-bold text-[#9E4756] mt-1">
              Rs. 218,000
            </p>
            <p className="text-xs text-[#5C3D42] mt-2">41 monthly orders (~Rs. 76,000 projected net monthly profit).</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#EBD8D6]">
            <p className="text-xs font-bold uppercase text-[#6E3B43]">Area of Success</p>
            <p style={{ fontFamily: "var(--font-serif)" }} className="text-2xl font-bold text-[#2D1418] mt-1">
              Karachi, Lahore &amp; Islamabad
            </p>
            <p className="text-xs text-[#5C3D42] mt-2">Women aged 18–45, university students &amp; bridal gift buyers.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBD8D6] overflow-hidden">
          <div className="px-6 py-4 bg-[#F7ECEB] border-b border-[#EBD8D6]">
            <h3 className="font-bold text-sm text-[#2D1418]">Google Keyword Planner Analysis (Pakistan)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FBF6F5] text-[#6E3B43] border-b border-[#EBD8D6]">
                <tr>
                  <th className="py-3 px-6 font-bold">Keyword</th>
                  <th className="py-3 px-6 font-bold">Avg. Monthly Searches</th>
                  <th className="py-3 px-6 font-bold">Competition</th>
                  <th className="py-3 px-6 font-bold">Suggested Bid (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4E7E6]">
                <tr>
                  <td className="py-3 px-6 font-semibold">buy makeup online pakistan</td>
                  <td className="py-3 px-6">10,000 – 100,000</td>
                  <td className="py-3 px-6">High</td>
                  <td className="py-3 px-6">Rs. 45 – 90</td>
                </tr>
                <tr>
                  <td className="py-3 px-6 font-semibold">matte lipstick set pakistan</td>
                  <td className="py-3 px-6">1,000 – 10,000</td>
                  <td className="py-3 px-6">Medium</td>
                  <td className="py-3 px-6">Rs. 35 – 70</td>
                </tr>
                <tr>
                  <td className="py-3 px-6 font-semibold">rose gold eyeshadow palette</td>
                  <td className="py-3 px-6">1,000 – 10,000</td>
                  <td className="py-3 px-6">Medium</td>
                  <td className="py-3 px-6">Rs. 40 – 80</td>
                </tr>
                <tr>
                  <td className="py-3 px-6 font-semibold">makeup brushes and blush set</td>
                  <td className="py-3 px-6">1,000 – 10,000</td>
                  <td className="py-3 px-6">Low-Medium</td>
                  <td className="py-3 px-6">Rs. 25 – 55</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Product Quick-View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setQuickViewProduct(null)} className="absolute inset-0 bg-[#2D1418]/60 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#EBD8D6]">
            <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-60 object-cover" />
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A85764]">
                    {quickViewProduct.pieces}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-serif)" }} className="text-xl font-bold text-[#2D1418]">
                    {quickViewProduct.name}
                  </h3>
                </div>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="text-xs font-bold text-[#6E3B43] hover:text-[#2D1418]"
                >
                  Close ✕
                </button>
              </div>
              <p className="text-xs sm:text-sm text-[#5C3D42]">{quickViewProduct.description}</p>
              <ul className="space-y-1.5">
                {quickViewProduct.highlights.map((h, idx) => (
                  <li key={idx} className="text-xs text-[#2D1418] flex items-center gap-2">
                    <span className="text-[#9E4756] font-bold">✓</span> {h}
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t border-[#F4E7E6] flex items-center justify-between">
                <span className="text-xl font-bold text-[#2D1418]">Rs. {quickViewProduct.price.toLocaleString()}</span>
                <button
                  onClick={() => addToBag(quickViewProduct)}
                  className="bg-[#9E4756] hover:bg-[#823643] text-white text-xs font-bold px-6 py-3 rounded-full transition"
                >
                  Add Set to Beauty Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-Over Beauty Bag Drawer */}
      {bagOpen && (
        <div className="fixed inset-0 z-50">
          <div onClick={() => setBagOpen(false)} className="absolute inset-0 bg-[#2D1418]/50 backdrop-blur-xs" />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="p-5 border-b border-[#EBD8D6] flex items-center justify-between">
              <h3 style={{ fontFamily: "var(--font-serif)" }} className="font-bold text-xl text-[#2D1418]">
                Your Beauty Bag
              </h3>
              <button onClick={() => setBagOpen(false)} className="text-xs font-bold text-[#6E3B43]">
                Close ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <p className="text-sm text-[#6E3B43] text-center py-12">Your beauty bag is currently empty.</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 items-center bg-[#FBF6F5] p-3 rounded-2xl border border-[#EBD8D6]"
                    >
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-[#2D1418]">{item.name}</h4>
                        <p className="text-xs font-bold text-[#9E4756] mt-0.5">
                          Rs. {(item.price * item.qty).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-6 h-6 rounded-full bg-white border border-[#DFC5C3] text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-6 h-6 rounded-full bg-white border border-[#DFC5C3] text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-[#EBD8D6]">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#2D1418] mb-2">
                      Choose Payment Method
                    </p>
                    <div className="space-y-2">
                      {PAYMENT_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedPayment(opt.id)}
                          className={`w-full text-left p-3 rounded-2xl border transition ${
                            selectedPayment === opt.id
                              ? "border-[#9E4756] bg-[#9E4756]/5"
                              : "border-[#EBD8D6] bg-white"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-[#2D1418]">{opt.label}</span>
                            <span className="text-[10px] font-bold text-[#9E4756]">{opt.tag}</span>
                          </div>
                          {selectedPayment === opt.id && (
                            <p className="text-[11px] text-[#5C3D42] mt-1">{opt.instructions}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-5 border-t border-[#EBD8D6] bg-[#FBF6F5] space-y-3">
              <div className="flex justify-between font-bold text-base text-[#2D1418]">
                <span>Bag Total:</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <button
                onClick={handleWhatsAppOrder}
                disabled={cart.length === 0}
                className="w-full bg-[#2D1418] hover:bg-[#4A2228] disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-full transition"
              >
                Confirm via WhatsApp ({activePayment.label.split(" (")[0]})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-[#2D1418] text-[#F7DCE0] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div>
            <p style={{ fontFamily: "var(--font-serif)" }} className="text-lg font-bold text-white">
              Maryam&apos;s Glam Beauty Studio
            </p>
            <p className="mt-1 text-[#D8B4B8]">
              JazzCash • Easypaisa • Raast / Bank Transfer • Visa/Mastercard • COD | WhatsApp: +92 316 8242863
            </p>
          </div>
          <p className="text-[#D8B4B8]">© 2026 Maryam&apos;s Glam Beauty Studio</p>
        </div>
      </footer>
    </div>
  );
}
