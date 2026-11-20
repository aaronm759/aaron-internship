import React, { useEffect, useState} from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import EthImage from "../images/ethereum.svg";
import { Link } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";

const ItemDetails = () => {

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("nftId");
  
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    const fetchItem = async () => {
      try {
        const response = await axios.get(`https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${itemId}`);
        setItem(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItem();
    } else {
      setLoading(false);
    }
  }, [itemId]);


  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            {loading ? (
              <div className="row" role="status" aria-label="Loading item details" aria-busy="true">
                <div className="col-md-6">
                  <div className="img-rounded mb-sm-30" style={{ backgroundColor: "#e0e0e0", width: "100%", aspectRatio: "1 / 1" }} />
                </div>
                <div className="col-md-6">
                  <div className="item_info" aria-hidden="true">
                    <div style={{ backgroundColor: "#e0e0e0", height: 32, width: "70%", marginBottom: 24 }} />
                    <div style={{ backgroundColor: "#e0e0e0", height: 20, width: "35%", marginBottom: 24 }} />
                    <div style={{ backgroundColor: "#e0e0e0", height: 60, width: "100%", marginBottom: 24 }} />
                    <div style={{ backgroundColor: "#e0e0e0", height: 48, width: "50%", marginBottom: 24 }} />
                    <div style={{ backgroundColor: "#e0e0e0", height: 48, width: "50%", marginBottom: 24 }} />
                    <div style={{ backgroundColor: "#e0e0e0", height: 24, width: "25%" }} />
                  </div>
                </div>
              </div>
            ) : (
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={item?.nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt=""
                />
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  <h2>{item?.title}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {item?.views || 0}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      {item?.likes || 0}
                    </div>
                  </div>
                  <p>
                    {item?.description || "No description available."}
                  </p>
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author?author=${item?.ownerId}`}>
                            <img className="lazy" src={item?.ownerImage || AuthorImage} alt="" />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author?author=${item?.ownerId}`}>{item?.ownerName || "Monica Lucas"}</Link>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author?author=${item?.creatorId}`}>
                            <img className="lazy" src={item?.creatorImage || AuthorImage} alt="" />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author?author=${item?.creatorId}`}>{item?.creatorName || "Monica Lucas"}</Link>
                        </div>
                      </div>
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="" />
                      <span>{item?.price || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
