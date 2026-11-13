import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const NewItems = () => {
  const [newItems, setNewItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [timers, setTimers] = useState([]);
  const carouselRef = useRef(null);
  
  

  const initialTimers = (itemArray) =>{
    const result = [];
    for (const item of itemArray) {
        
        const timeRemaining = item.expiryDate - Date.now();
        
        if (timeRemaining > 0) {
            
            result.push({
                id: item.id,
                timeLeft: timeRemaining,
            })
        };
    };
   
    console.log('result', result);
    
    
    return result;
  };

  useEffect(() => {
    let active = true;
    const fetchNewItems = async () => {
      try {
        const response = await axios.get("https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems");
         const items = Array.isArray(response.data) ? response.data : [];
         setNewItems(items);
         setTimers(initialTimers(items));
      } catch (err) {
        console.error("Failed to fetch new items:", err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchNewItems();
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

  }, [loading, newItems]);

  const scroll = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.querySelector(".new-items-slide");
    const distance = card ? card.getBoundingClientRect().width + 24 : carousel.clientWidth;
    carousel.scrollBy({ left: direction * distance, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  /*=================================
    Timer Management for New Items
    - Initializes timers based on item expiry dates
    - Updates timers every second using requestAnimationFrame
  */





  
  

  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);
   const accumulatedTimeRef = useRef(0);

  // Core Animation Loop
  useEffect(() => {
    const animate = (time) => {
      if (previousTimeRef.current !== null) {

        const deltaTimeMs = time - previousTimeRef.current;        
        accumulatedTimeRef.current += deltaTimeMs;

        const secondsElapsed = Math.floor(accumulatedTimeRef.current / 1000);

        if (secondsElapsed >= 1) {
          
          
          setTimers((prevTimers) => {
            
            const updatedTimers = [];

            for (const timer of prevTimers) {
            
              
                // Subtract elapsed seconds from the timer
                const nextRemaining = timer.timeLeft - (secondsElapsed * 1000);
                
                updatedTimers.push({ ...timer, timeLeft: nextRemaining });
                
              
            }

            accumulatedTimeRef.current = 0; // Reset accumulated time after update
            return updatedTimers;
          });
        }
      }

      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    // Check if at least one timer is actively counting down
    const anyActive = timers.length > 0;

    if (anyActive) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      previousTimeRef.current = null; // Reset baseline when loop rests
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [timers]); // React bounds lookups against active state switches

 

  // Helper to format remaining fractional seconds into MM:SS
  const formatTime = (timeRemaining) => {    
    
    const totalSeconds = timeRemaining / 1000 //convert to seconds
    const rawHours = Math.floor(totalSeconds / 3600)
    const rawMins = Math.floor((totalSeconds - (rawHours * 3600)) / 60)
    const secs = Math.floor((totalSeconds - (rawHours * 3600)) - (rawMins * 60)).toString().padStart(2, "0");
    const hours = rawHours.toString().padStart(2, "0");
    const mins = rawMins.toString().padStart(2, "0");
    return `${hours}:${mins}:${secs}`;

  };


  return (
    <section id="section-items" className="no-bottom">
      <style>{`
        .new-items-carousel { display: flex; gap: 24px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding: 8px 0 20px; }
        .new-items-carousel::-webkit-scrollbar { display: none; }
        .new-items-slide { flex: 0 0 calc((100% - 72px) / 4); min-width: 0; scroll-snap-align: start; }
        .new-items-controls { display: flex; justify-content: flex-end; gap: 8px; margin: 0 0 8px; }
        .new-items-controls button { width: 40px; height: 40px; border: 1px solid currentColor; border-radius: 50%; background: transparent; color: inherit; font-size: 22px; cursor: pointer; }
        .new-items-controls button:disabled { opacity: .35; cursor: default; }
        .new-items-controls button:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
        .new-items-skeleton { background: linear-gradient(90deg, #dedee3 25%, #f1f1f4 50%, #dedee3 75%); background-size: 200% 100%; animation: new-items-shimmer 1.4s infinite linear; }
        .new-items-skeleton-image { width: 100%; aspect-ratio: 1 / 1; border-radius: 8px; }
        .new-items-skeleton-avatar { width: 56px; height: 56px; border-radius: 50%; margin: 0 0 16px; position: relative; border: 3px solid white; }
        .new-items-skeleton-line { height: 15px; border-radius: 6px; margin: 14px 0; width: 65%; }
        .new-items-skeleton-line.short { width: 35%; }
        @keyframes new-items-shimmer { to { background-position: -200% 0; } }
        @media (max-width: 991px) { .new-items-slide { flex-basis: calc((100% - 24px) / 2); } }
        @media (max-width: 575px) { .new-items-slide { flex-basis: 100%; } }
        @media (prefers-reduced-motion: reduce) { .new-items-skeleton { animation: none; } .new-items-carousel { scroll-behavior: auto; } }
      `}</style>
      <div className="container">
        <div className="text-center">
          <h2>New Items</h2>
          <div className="small-border bg-color-2"></div>
        </div>
        {!loading && newItems.length > 0 && (
          <div className="new-items-controls" aria-label="Carousel controls">
            <button type="button" aria-label="Previous items" disabled={!canScrollLeft} onClick={() => scroll(-1)}>‹</button>
            <button type="button" aria-label="Next items" disabled={!canScrollRight} onClick={() => scroll(1)}>›</button>
          </div>
        )}
        {error && <p role="alert">Unable to load items. Please try again later.</p>}
        {!loading && !error && newItems.length === 0 && <p>No items available right now.</p>}
        <div ref={carouselRef} className="new-items-carousel" aria-label="New items" aria-busy={loading} tabIndex={loading || !newItems.length ? undefined : 0}>
          {loading ? Array.from({ length: 4 }, (_, index) => (
            <div className="new-items-slide" key={index} aria-hidden="true">
              <div className="nft__item">
                <div className="new-items-skeleton new-items-skeleton-avatar" />
                <div className="new-items-skeleton new-items-skeleton-image" />
                <div className="new-items-skeleton new-items-skeleton-line" />
                <div className="new-items-skeleton new-items-skeleton-line short" />
              </div>
            </div>
          )) : newItems.map((item, index) => (
            <div className="new-items-slide" key={item.id ?? index}>
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link
                    to="/author"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Creator: Monica Lucas"
                  >
                    <img className="lazy" src={item.authorImage} alt="Item creator" />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                 {timers.find(timer => timer.id === item.id)?.timeLeft > 0 ?(
                    <div className="de_countdown">                 
                        {formatTime(timers.find(timer => timer.id === item.id)?.timeLeft)}
                    </div>
                  ) : (<div className="de_countdown" style={{display:'none'}}></div>)
                 }
                

                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
                      <div className="nft__item_share">
                        <h4>Share</h4>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-facebook fa-lg"></i>
                        </a>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-twitter fa-lg"></i>
                        </a>
                        <a href="">
                          <i className="fa fa-envelope fa-lg"></i>
                        </a>
                      </div>
                    </div>
                  </div>

                  <Link to="/item-details">
                    <img
                      src={item.nftImage}
                      className="lazy nft__item_preview"
                      alt={item.title || "NFT item"}
                    />
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link to="/item-details">
                    <h4>{item.title}</h4>
                  </Link>
                  <div className="nft__item_price">{item.price} ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{item.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {loading && <span role="status" className="sr-only">Loading items...</span>}
      </div>
    </section>
  );
};

export default NewItems;
