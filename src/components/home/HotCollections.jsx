import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const HotCollections = () => {
  const [hotCollections, setHotCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    let active = true;
    const fetchHotCollections = async () => {
      try {
        const response = await axios.get("https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections");
        if (active) setHotCollections(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch hot collections:", err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchHotCollections();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || loading) return;
    const updateControls = () => {
      setCanScrollLeft(carousel.scrollLeft > 1);
      setCanScrollRight(carousel.scrollLeft + carousel.clientWidth < carousel.scrollWidth - 1);
    };
    updateControls();
    carousel.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    return () => {
      carousel.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, [loading, hotCollections]);

  const scroll = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.querySelector(".hot-collections-slide");
    const distance = card ? card.getBoundingClientRect().width + 24 : carousel.clientWidth;
    carousel.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <section id="section-collections" className="no-bottom">
      <style>{`
        .hot-collections-carousel { display: flex; gap: 24px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding: 8px 0 20px; }
        .hot-collections-carousel::-webkit-scrollbar { display: none; }
        .hot-collections-slide { flex: 0 0 calc((100% - 72px) / 4); min-width: 0; scroll-snap-align: start; }
        .hot-collections-controls { display: flex; justify-content: flex-end; gap: 8px; margin: 0 0 8px; }
        .hot-collections-controls button { width: 40px; height: 40px; border: 1px solid currentColor; border-radius: 50%; background: transparent; color: inherit; font-size: 22px; cursor: pointer; }
        .hot-collections-controls button:disabled { opacity: .35; cursor: default; }
        .hot-collections-controls button:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
        .hot-skeleton { background: linear-gradient(90deg, #dedee3 25%, #f1f1f4 50%, #dedee3 75%); background-size: 200% 100%; animation: hot-shimmer 1.4s infinite linear; }
        .hot-skeleton-image { width: 100%; aspect-ratio: 1 / 1; border-radius: 8px; }
        .hot-skeleton-avatar { width: 56px; height: 56px; border-radius: 50%; margin: -28px auto 14px; position: relative; border: 3px solid white; }
        .hot-skeleton-line { height: 15px; border-radius: 6px; margin: 10px auto; width: 65%; }
        .hot-skeleton-line.short { width: 35%; }
        @keyframes hot-shimmer { to { background-position: -200% 0; } }
        @media (max-width: 991px) { .hot-collections-slide { flex-basis: calc((100% - 24px) / 2); } }
        @media (max-width: 575px) { .hot-collections-slide { flex-basis: 100%; } }
        @media (prefers-reduced-motion: reduce) { .hot-skeleton { animation: none; } .hot-collections-carousel { scroll-behavior: auto; } }
      `}</style>
      <div className="container">
        <div className="text-center">
          <h2>Hot Collections</h2>
          <div className="small-border bg-color-2"></div>
        </div>
        {!loading && hotCollections.length > 0 && (
          <div className="hot-collections-controls" aria-label="Carousel controls">
            <button type="button" aria-label="Previous collections" disabled={!canScrollLeft} onClick={() => scroll(-1)}>‹</button>
            <button type="button" aria-label="Next collections" disabled={!canScrollRight} onClick={() => scroll(1)}>›</button>
          </div>
        )}
        {error && <p role="alert">Unable to load collections. Please try again later.</p>}
        {!loading && !error && hotCollections.length === 0 && <p>No collections available right now.</p>}
        <div ref={carouselRef} className="hot-collections-carousel" aria-label="Hot collections" aria-busy={loading} tabIndex={loading || !hotCollections.length ? undefined : 0}>
          {loading ? Array.from({ length: 4 }, (_, index) => (
            <div className="hot-collections-slide" key={index} aria-hidden="true">
              <div className="nft_coll">
                <div className="hot-skeleton hot-skeleton-image" />
                <div className="hot-skeleton hot-skeleton-avatar" />
                <div className="hot-skeleton hot-skeleton-line" />
                <div className="hot-skeleton hot-skeleton-line short" />
              </div>
            </div>
          )) : hotCollections.map((collection, index) => (
            <div className="hot-collections-slide" key={collection.id ?? index}>
              <div className="nft_coll">
                <div className="nft_wrap">
                  <Link to="/item-details"><img src={collection.nftImage} className="lazy img-fluid" alt={collection.title || "Collection"} /></Link>
                </div>
                <div className="nft_coll_pp">
                  <Link to="/author"><img className="lazy pp-coll" src={collection.authorImage} alt="Collection author" /></Link>
                  <i className="fa fa-check" />
                </div>
                <div className="nft_coll_info">
                  <Link to="/explore"><h4>{collection.title}</h4></Link>
                  <span>ERC-{collection.code}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {loading && <span role="status" className="sr-only">Loading collections...</span>}
      </div>
    </section>
  );
};

export default HotCollections;