"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import HeroSequence from "@/components/HeroSequence";

export default function Home() {
  const heroRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Intersection Observer for fade-ins (excluding hero bottle animation)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const fadeElements = document.querySelectorAll(".fade-in-up");
    fadeElements.forEach((el) => observer.observe(el));

    // Handle scroll for header
    const handleScroll = () => {
      const header = document.querySelector(".site-header");
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Init

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="container header-container">
          <div className="logo">
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/images_resources/logo.png" alt="Maharajan Logo" style={{ height: '36px', width: 'auto' }} />
              MAHARAJAN
            </a>
          </div>
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          </button>
          <nav className={`main-nav ${isMobileMenuOpen ? 'open' : ''}`}>
            <ul>
              <li><a href="#heritage" onClick={() => setIsMobileMenuOpen(false)}>Our Heritage</a></li>
              <li><a href="#process" onClick={() => setIsMobileMenuOpen(false)}>Purity Process</a></li>
              <li><a href="#benefits" onClick={() => setIsMobileMenuOpen(false)}>Benefits</a></li>
              <li><a href="#contact" className="nav-btn-contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <h1 className="sr-only">Balaji Mills Premium Yellow Mustard Oil (Peele Sarso Ka Tel)</h1>
        <section className="hero-scroll-wrapper" ref={heroRef}>
          <div className="hero-sticky-container">
            <section className="hero-section">
              <HeroSequence scrollContainerRef={heroRef} />
            </section>
          </div>
        </section>

        <section className="benefits-section" id="benefits">
          <div className="container">
            <div className="benefits-grid">
              <div className="benefits-text fade-in-up">
                <span className="section-kicker">Experience Health with Every Drop</span>
                <h2 className="editorial-headline">Crafted for the modern kitchen, honoring ancient wisdom.</h2>
                <p>Our premium yellow mustard oil is naturally rich in MUFA, PUFA, and essential Omega 3 & 6 fatty acids. It aids digestion, promotes heart health, and elevates the authentic taste of your culinary creations.</p>
              </div>
              <div className="benefits-visuals">
                <div className="image-tile fade-in-up" style={{ transitionDelay: "0.1s" }}>
                  <img src="/images_resources/img5.png" alt="Frying" onError={(e) => { e.target.style.backgroundColor = '#dbbb71'; e.target.src = ''; }} />
                  <div className="visual-label">High Smoke Point<br />(Perfect for Frying)</div>
                </div>
                <div className="image-tile fade-in-up" style={{ transitionDelay: "0.2s" }}>
                  <img src="/images_resources/img6.png" alt="Aroma" onError={(e) => { e.target.style.backgroundColor = '#c99f36'; e.target.src = ''; }} />
                  <div className="visual-label">Rich Natural Aroma<br />& Golden Color</div>
                </div>
              </div>
            </div>

            <div className="benefits-columns fade-in-up">
              <div className="benefit-col">
                <div className="benefit-icon">🌼</div>
                <h3>Sourced from Finest Yellow Seeds</h3>
                <p>Handpicked from selected farms ensuring the highest grade of raw material.</p>
              </div>
              <div className="benefit-col">
                <div className="benefit-icon">🪵</div>
                <h3>Traditional Processing (Kachi Ghani)</h3>
                <p>Extracted at low temperatures to keep natural antioxidants intact.</p>
              </div>
              <div className="benefit-col">
                <div className="benefit-icon">🛡️</div>
                <h3>Immunity & Wellness Booster</h3>
                <p>Packed with natural properties that support a healthy immune system.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="ingredients-section" id="process">
          <div className="container">
            <div className="ingredients-showcase fade-in-up">
              <div className="images-strip">
                <img src="/images_resources/img2.png" alt="Yellow mustard flowers" className="strip-img" onError={(e) => { e.target.style.backgroundColor = '#eedca1'; e.target.src = ''; }} />
                <img src="/images_resources/img3.png" alt="Organic yellow seeds" className="strip-img" onError={(e) => { e.target.style.backgroundColor = '#d3a436'; e.target.src = ''; }} />
                <img src="/images_resources/img4.png" alt="Golden liquid oil" className="strip-img" onError={(e) => { e.target.style.backgroundColor = '#b8860b'; e.target.src = ''; }} />
              </div>
              <div className="quality-anchors">
                <div className="anchor-badge badge-1">100% Natural</div>
                <div className="anchor-badge badge-2">Cold Pressed</div>
                <div className="anchor-badge badge-3">Omega 3 & 6 Rich</div>
                <div className="anchor-badge badge-4">Zero Cholesterol</div>
              </div>
            </div>
          </div>
        </section>

        <section className="discovery-section" id="heritage">
          <div className="container">
            <h2 className="discovery-headline fade-in-up">The Royal Standards of Purity</h2>

            <div className="product-discovery fade-in-up">
              <div className="discovery-bottle-wrap">
                <img src="/images_resources/img_bg_removed.png" alt="Maharajan 1 Liter Glass Bottle" className="discovery-bottle" />
              </div>

              <div className="discovery-info">
                <h3>Signature 1 Liter Glass Bottle</h3>
                <p>Preserving the liquid gold in pristine condition, free from plastic leaching. Our elegant glass bottle ensures the authentic taste and aroma remain uncompromised.</p>
                <div className="variant-info">
                  <h4>Also available in:</h4>
                  <ul>
                    <li>5 Liter Premium Tin (Kitchen Sizing)</li>
                    <li>15 Liter Bulk Pack (Professional Use)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="container footer-container">
          <div className="footer-top">
            <div className="footer-statement">
              <h2>Bring the Taste of Royalty to Your Kitchen.</h2>
              <a href="https://wa.me/7037404784" target="_blank" rel="noopener noreferrer" className="btn-primary dark-btn" style={{ backgroundColor: "#1C1A17" }}>Contact Us</a>
            </div>
            <div className="footer-imagery">
              <img src="/images_resources/img1.png" alt="Oil splashing" className="footer-img" onError={(e) => { e.target.style.opacity = '0'; e.target.src = ''; }} />
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-col">
              <div className="logo">MAHARAJAN</div>
              <p className="contact-detail">shreebalajioilmillusmapur@gmail.com</p>
              <p className="contact-detail">+91 7037404784</p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#heritage">About Us</a></li>
                <li><a href="#process">Quality Process</a></li>
                <li><a href="#benefits">Health Benefits</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">FSSAI Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-copyright">
            <p>&copy; 2026 Maharajan Premium Mustard Oils. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
