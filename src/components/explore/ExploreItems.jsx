import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ItemCards from "../ItemCards";


const ExploreItems = () => {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [criteria, setCriteria] = useState(""); 

  useEffect(() => {
    const fetchItems = async () => {
      const response = await axios.get("https://us-central1-nft-cloud-functions.cloudfunctions.net/explore");
      setItems((response.data).slice(0, 8));
      setLoading(false);
    };
    fetchItems();
  }, [])

  const filterItems = async (criteria) => {
    let filteredItems = await axios.get(`https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?filter=${criteria}`);
    setItems((filteredItems.data).slice(0, 8));
  };

  const loadMore = async() => {

    const url = criteria === "" ? "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore" : `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?filter=${criteria}`;

    if(items.length === 16) return 
    if(items.length === 12) {
      const response = await axios.get(url);
      setItems((response.data).slice(0, 16));
      
    }
    if(items.length === 8) {
      const response = await axios.get(url);
      setItems((response.data).slice(0, 12));
      
    }
    
  };

  
  
  ;
  return (
    <>
      <div>
        <select id="filter-items" defaultValue="" onChange={(e) => { setCriteria(e.target.value); filterItems(e.target.value, items); }}>
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      { loading ? (new Array(8).fill(0).map((_, index) => (
        <div
          key={index}
          className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          aria-hidden="true"
        >
          <div className="nft__item placeholder-glow">
            <div className="author_list_pp">
              <span
                className="placeholder rounded-circle"
                style={{ width: 40, height: 40 }}
              />
            </div>
            <div className="de_countdown">
              <span className="placeholder col-6" />
            </div>
            <div className="nft__item_wrap">
              <span className="placeholder w-100" style={{ height: 220 }} />
            </div>
            <div className="nft__item_info">
              <h4><span className="placeholder col-7" /></h4>
              <div className="nft__item_price">
                <span className="placeholder col-4" />
              </div>
              <div className="nft__item_like">
                <span className="placeholder col-3" />
              </div>
            </div>
          </div>
        </div>)
      )) : (
        <>       
            <ItemCards items={items} wrapperClass="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12" 
            wrapperStyle={{  display: "block", backgroundSize: "cover"  }}
            />
        
        </>
      )}
      <div className="col-md-12 text-center">
        <Link to="" id="loadmore" className="btn-main lead" onClick={loadMore}>
          Load more
        </Link>
      </div>
    </>
  );
};

export default ExploreItems;
