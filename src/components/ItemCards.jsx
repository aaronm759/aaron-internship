import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";



const ItemCards = (props) => {

    const { items, wrapperClass, wrapperStyle } = props;
    const [timers, setTimers] = useState(initialTimers(items));
    const requestRef = useRef(null);
    const previousTimeRef = useRef(null);
    const accumulatedTimeRef = useRef(0);

    function initialTimers(items) {
        const result = [];
        for (const item of items) {
            
            const timeRemaining = item.expiryDate - Date.now();
            
            if (timeRemaining > 0) {
                
                result.push({
                    id: item.id,
                    timeLeft: timeRemaining,
                })
            };
        };
    
        
        
        
        return result;
    };

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
    }, [timers]);

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
    <>
        
      {items.map((item, index) => (
        <div className={wrapperClass ?? ""} style={wrapperStyle ?? {}} key={item.id ?? index}>
         
                  
            <div className="nft__item" key={item.id ?? index}>
                      <div className="author_list_pp">
                        <Link
                          to={`/author/${item.authorId}`}
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
              
    </>
  );
};

export default ItemCards;