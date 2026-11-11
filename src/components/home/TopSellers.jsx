import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      const response = await axios.get("https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers");
      setSellers(response.data);
      setLoading(false);
    };
    fetchSellers();
  }, []);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            <ol className="author_list">
              {loading ? new Array(12).fill(0).map((_, index) => (
                <li key={index} aria-hidden="true">
                  <div className="author_list_pp">
                    <div
                      className="placeholder rounded-circle pp-author"
                      style={{ width: 50, height: 50 }}
                    />
                  </div>
                  <div className="author_list_info placeholder-glow">
                    <span className="placeholder col-8" />
                    <span className="placeholder col-4" />
                  </div>
                </li>
              )) : sellers.map((seller, index) => (
                <li key={index}>
                  <div className="author_list_pp">
                    <Link to={`/author/${seller.authorId}`}>
                      <img
                        className="lazy pp-author"
                        src={seller.authorImage}
                        alt=""
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  <div className="author_list_info">
                    <Link to={`/author/${seller.authorId}`}>{seller.authorName}</Link>
                    <span>{seller.price} ETH</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
