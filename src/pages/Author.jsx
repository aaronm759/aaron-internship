import { useEffect, useState } from "react";
import axios from "axios";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { Link, useSearchParams } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";

const Author = () => {
  ;

  const [searchParams] = useSearchParams();
  const authorId = searchParams.get("author");
  const [author, setAuthor] = useState({});
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
  

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.get(`https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`);
        setAuthor(response.data);
        setFollowers(response.data.followers || 0);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    if (authorId) {
      fetchAuthor();
    } else {
      setLoading(false);
    }
  }, [authorId]);

  function handleSubscribe() {
    setSubscribed(!subscribed);
    setFollowers(subscribed ? followers - 1 : followers + 1);
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              {loading ? (
                <div className="col-md-12 placeholder-glow" aria-busy="true" aria-label="Loading author profile">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <div className="placeholder rounded-circle bg-secondary" style={{ width: 100, height: 100 }} />
                        <div className="profile_name">
                          <h4>
                            <span className="placeholder bg-secondary col-4 d-block mb-2" />
                            <span className="placeholder bg-secondary col-3 d-block mb-2" />
                            <span className="placeholder bg-secondary col-5 d-block" />
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="profile_follow de-flex">
                      <span className="placeholder bg-secondary col-8" />
                    </div>
                  </div>
                  <div className="row mt-5">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div className="col-md-3 col-6 mb-4" key={index}>
                        <div className="placeholder bg-secondary w-100" style={{ height: 180 }} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="col-md-12">
                    <div className="d_profile de-flex">
                      <div className="de-flex-col">
                        <div className="profile_avatar">
                          <img src={author?.authorImage || AuthorImage} alt="" />

                          <i className="fa fa-check"></i>
                          <div className="profile_name">
                            <h4>
                              {author?.authorName || "Monica Lucas"}
                              <span className="profile_username">@{author?.tag || "monicaaaa"}</span>
                              <span id="wallet" className="profile_wallet">
                                {author?.address || "No wallet"}
                              </span>
                              <button id="btn_copy" title="Copy Text">
                                Copy
                              </button>
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="profile_follow de-flex">
                        <div className="de-flex-col">
                          <div className="profile_follower">{followers} followers</div>
                          <Link to="#" className="btn-main" onClick={handleSubscribe}>
                            {subscribed ? "Unfollow" : "Follow"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="de_tab tab_simple">
                      <AuthorItems nfts={author?.nftCollection || []} author={author} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
