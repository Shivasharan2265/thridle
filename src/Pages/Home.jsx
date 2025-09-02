import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "./Testimonials.css";
import { FaFacebook, FaPinterestP, FaTwitter, FaYoutube } from "react-icons/fa";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();


  const [blogPosts, setBlogPosts] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const [brands, setBrands] = useState([]);
  const [pCategories, setPCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);


  const [categories, setCategories] = useState([]);
  const [pPoducts, setPProducts] = useState([]);


  const [mainBanners, setMainBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [secBanners, setSecBanners] = useState([]);
  const [footerBanners, setFooterBanners] = useState([]);

  const [loadingBanners, setLoadingBanners] = useState(true);
  const [featuredVideoUrl, setFeaturedVideoUrl] = useState("");


  const mainSliderOptions = {
    items: 1,
    loop: true,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 4000,
    smartSpeed: 1000,
  };

  const categorySliderOptions = {
    items: 4,
    loop: false,
    nav: false,
    dots: false,
    margin: 20,
    autoplay: true,
    responsive: {
      0: { items: 3 },
      576: { items: 3 },
      768: { items: 3 },
      992: { items: 3 },
      1200: { items: 3 },
    },
    // responsive: {
    //   0: { items: 1 },
    //   576: { items: 1 },
    //   768: { items: 1 },
    //   992: { items: 1 },
    //   1200: { items: 1 },
    // },
  };

  const carouselOptions = {
    items: 4,
    loop: true,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    smartSpeed: 1000,
    margin: 20,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 4 },
    },
  };

  const latestOptions = {
    items: 3, // default for large screens
    loop: true,
    margin: 30,
    nav: true,
    dots: false,
    autoplay: true,
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      992: { items: 3 }, // 3 items from medium screens onward
      1200: { items: 3 },
    },
  };

  const loadProducts = async () => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "getProductDetails");
    fd.append("featured", "yes");

    try {
      const response = await api.post("/ecom/products", fd);
      console.log("trending", response);

      if (
        response?.data?.success === false &&
        response?.data?.data === "Unauthorized user"
      ) {
        console.warn("Token expired or invalid");

        // Clear token
        localStorage.removeItem("authToken");

        // Optional: redirect
        window.location.href = "/login";

        return;
      }

      if (response?.data?.success && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Product API Error:", error);
    }
    finally {
      setLoading(false);
    }
  };
  const fetchBlogs = async () => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "getBlogDetails");

    try {
      const response = await api.post("/ecom/settings", fd);
      console.log("blog", response);

      if (response?.data?.success && Array.isArray(response.data.data)) {
        setBlogPosts(response.data.data);
        setImagesLoaded(false); // Reset
      }

    } catch (error) {
      console.error("Blog API Error:", error);
    }
  };

  const featuredVideo = async () => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "getFeaturedVideoDetailsInDashboard");

    try {
      const response = await api.post("/ecom/products", fd);
      console.log("video", response);

      if (
        response?.data?.success &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        setFeaturedVideoUrl(response.data.data[0].featuredUrl);
      }
    } catch (error) {
      console.error("Video fetch error:", error);
    }
  };


  useEffect(() => {
    if (blogPosts.length === 0) return;

    let loaded = 0;

    blogPosts.forEach((blog) => {
      const img = new Image();
      img.src = `https://thridle.com/ecom/storage/app/public/blog/image/${blog.image}`;
      img.onload = () => {
        loaded++;
        if (loaded === blogPosts.length) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loaded++;
        if (loaded === blogPosts.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, [blogPosts]);



  useEffect(() => {
    fetchCategories();
    loadProducts();
    featuredVideo()
    fetchBlogs()
    // fetchBanners();
    // fetchSecBanner();
    // fetchFooterBanner();
    fetchBrandDetails();
    fetchAllBanners();

  }, []);

const fetchCategories = async () => {
  const fd = new FormData();
  fd.append("authToken", localStorage.getItem("authToken") || "Guest");
  fd.append("programType", "getCategoryDetails");

  try {
    const response = await api.post("/ecom/category", fd);
    console.log("categories", response);

    if (response?.data?.success) {
      let categories = response.data.data;

      // Move 'Infant' to the first position
      categories.sort((a, b) => {
        if (a.name === "Infant") return -1;
        if (b.name === "Infant") return 1;
        return 0;
      });

      // Set categories state
      setCategories(response.data.data);
      setPCategories(categories);

      // Select the first category automatically
      if (categories.length > 0) {
        setSelectedCategory(categories[0].id);
        fetchProducts(categories[0].id); // Load products for first category
      }
    }
  } catch (error) {
    console.error("Category API Error:", error);
  }
};



  const fetchProducts = async (categoryId) => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "getProductDetails");
    fd.append("category", categoryId);

    for (let pair of fd.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await api.post("/ecom/products", fd);
      console.log("nnnn", response);

      if (response?.data?.success && response?.data?.data?.length > 0) {
        setPProducts(response.data.data.slice(0, 3)); // show first 3
      } else {
        setPProducts([]); // clear products when none found
      }
    } catch (error) {
      console.error("Product API Error:", error);
      setPProducts([]); // also clear on error
    }
  };


  const fetchAllBanners = async () => {
    setLoadingBanners(true);
    const fd = new FormData();
    fd.append(
      "authToken",
      localStorage.getItem("authToken") || "Guest"
    );
    fd.append("programType", "getBannerDetails");
    fd.append("type", "ss"); // Leave blank to get all

    try {
      const response = await api.post("ecom/banner", fd);
      console.log("All Banners Response:", response);

      if (response?.data?.success) {
        const allBanners = response.data.data || [];

        const mainBanners = allBanners.filter(
          (b) => b.banner_type === "Main Banner"
        );
        const secBanners = allBanners.filter(
          (b) => b.banner_type === "Main Section Banner"
        );
        const footerBanners = allBanners.filter(
          (b) => b.banner_type === "Footer Banner"
        );

        setMainBanners(mainBanners);

        setSecBanners(secBanners);
        setFooterBanners(footerBanners);
      }
    } catch (error) {
      console.error("All Banner API Error:", error);
    } finally {
      setLoadingBanners(false);
    }
  };

  const fetchBrandDetails = async () => {
    const fd = new FormData();
    fd.append(
      "authToken",
      localStorage.getItem("authToken") || "Guest"
    );
    fd.append("programType", "getBrandDetails");

    try {
      const response = await api.post("ecom/brand", fd);
      if (response.data.success) {
        setBrands(response.data.data); // Save brand data
      }
    } catch (error) {
      console.error("Brand API Error:", error);
    }
  };

  const dummyProducts = [
    {
      id: 1,
      name: "Yellow Frock",
      unit_price: 670,
      discount: 30,
      images: JSON.stringify([
        { image_name: "2025-07-18-687a30885dcf3.webp" },
        { image_name: "2025-07-18-687a308867695.webp" }
      ]),
      details: "<p>Charming yellow sundress with ruffle sleeves.</p>"
    },
    {
      id: 2,
      name: "Pink Baby T-Shirt",
      unit_price: 450,
      discount: 20,
      images: JSON.stringify([
        { image_name: "2025-07-18-687a308867695.webp" },
        { image_name: "2025-07-18-687a30885dcf3.webp" }
      ]),
      details: "<p>Cute and comfy pink tee for toddlers.</p>"
    }
  ];


  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div id="top_home">
      {loadingBanners ? (
        <div
          style={{
            width: "100%",
            height: "300px",
            background:
              "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        />
      ) : (
        <>
          {mainBanners.length > 0 && (
            <OwlCarousel
              className="owl-theme ishislider-container"
              {...mainSliderOptions}
            >
              {mainBanners?.map((banner, idx) => (
                <img
                  key={idx}
                  src={`https://thridle.com/ecom/storage/app/public/banner/${banner.photo}`}
                  alt={`Banner ${idx + 1}`}
                  style={{
                    width: "100%",
                    maxHeight: "550px",
                    objectFit: "fill",
                    
                  }}
                />
              ))}
            </OwlCarousel>

          )}
        </>
      )}

      {/* <!-- -------------------category----------- --> */}
      <section id="ishicategory" class="ishicategoryblock">
        <h3 class="home-title">Shop By Category</h3>

        {categories.length > 0 ? (
          <div className="category-carousel-container">
            <OwlCarousel
              className="owl-theme ishicategoryblock-carousel"
              {...categorySliderOptions}
            >
              {categories?.map((item, index) => {
                const categoryImage =
                  item.icon && item.icon !== "null"
                    ? `https://thridle.com/ecom/storage/app/public/category/${item.icon}`
                    : "assets/images/category/default.png";

                return (
                  <div key={index} className="category-card">
                    <div className="category-item">
                      <Link to={`/category/${item.id}`} className="category-link">
                        <div className="category-image-container">
                          <img
                            src={categoryImage}
                            alt={item.name}
                            className="category-image"
                          />
                          <div className="category-overlay">
                            <span className="overlay-text">Shop Now</span>
                          </div>
                        </div>
                        <div className="category-name">{item.name}</div>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </OwlCarousel>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[...Array(isMobile ? 2 : 3)].map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: "360px",
                  height: "360px",
                  borderRadius: "18px",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.8)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "150px",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s infinite",
                  }}
                ></div>
                <div
                  style={{
                    width: "80%",
                    height: "16px",
                    margin: "14px auto 0",
                    borderRadius: "8px",
                    background:
                      "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s infinite",
                  }}
                ></div>
              </div>
            ))}
            {/* shimmer animation keyframes */}
            <style>
              {`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}
            </style>
          </div>
        )}


        <style>{`
    .ishicategoryblock {
      padding: 80px 20px;
      max-width: 1440px;
      margin: 0 auto;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Title */
    .home-title {
      position: relative;
      text-align: center;
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 2.5rem;
      background: linear-gradient(90deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .home-title:after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 70px;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 4px;
    }

    /* Card */
    .category-card {
      padding: 12px;
    }

    .category-item {
      transition: all 0.35s ease;
      border-radius: 18px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.08);
    }

    .category-item:hover {
      
      box-shadow: 0 20px 35px -5px rgba(0,0,0,0.15);
      border: none;
      background-image: linear-gradient(white, white),
        linear-gradient(90deg, #667eea, #764ba2);
      background-origin: border-box;
      background-clip: content-box, border-box;
    }

    /* Image */
    .category-image-container {
      position: relative;
      width: 100%;
      padding-top: 100%;
      border-radius: 16px 16px 0 0;
      overflow: hidden;
    }

    .category-image {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .category-item:hover .category-image {
      transform: scale(1.1);
    }

    /* Overlay */
    .category-overlay {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5));
      opacity: 0;
      transition: opacity 0.4s ease;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 15px;
    }

    .overlay-text {
      color: #fff;
      font-weight: 700;
      font-size: 1rem;
      text-shadow: 0 2px 6px rgba(0,0,0,0.6);
    }

    .category-item:hover .category-overlay {
      opacity: 1;
    }

    /* Name */
    .category-name {
      padding: 14px 12px;
      text-align: center;
      font-weight: 600;
      color: #2d3748;
      font-size: 1rem;
      transition: color 0.3s ease;
    }

    .category-item:hover .category-name {
      color: #764ba2;
    }

    /* Skeletons */
    .skeleton-item {
      width: 160px;
      text-align: center;
    }

    .skeleton-image {
      width: 160px;
      height: 160px;
      border-radius: 18px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: pulse 1.5s infinite;
      margin: 0 auto;
    }

    .skeleton-text {
      width: 90px;
      height: 18px;
      border-radius: 10px;
      background: #f0f0f0;
      margin: 14px auto 0;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .home-title { font-size: 1.7rem; margin-bottom: 1.8rem; }
      .category-name { font-size: 0.9rem; }
    }
   @media (max-width: 576px) {
  .category-card {
    padding: 6px;  /* reduce gap between cards */
  }
  .ishicategoryblock {
    padding: 50px 10px; /* less section padding */
  }
  .category-name {
    font-size: 0.85rem;
    padding: 10px 8px;
  }
}

  `}</style>
      </section>




      <section id="ishifourbanner" className="ishifourbannerblock">

        <h3 class="home-title">Offers</h3>

        <div className="row">
          {loadingBanners ? (
            // 🔄 Skeleton loader for all 3 columns
            <>
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="col-md-4 col-sm-12">
                  <div
                    style={{
                      width: "100%",
                      height: "300px",
                      background:
                        "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.5s infinite",
                      borderRadius: "10px",
                      marginBottom: "20px",
                    }}
                  />
                </div>
              ))}

              {/* Define shimmer keyframes inline */}
              <style>
                {`
              @keyframes shimmer {
                0% {
                  background-position: 200% 0;
                }
                100% {
                  background-position: -200% 0;
                }
              }
            `}
              </style>
            </>
          ) : (
            secBanners.length > 0 && (
              <>
                {["bannerleft", "bannercenter", "bannerright"].map((className, i) => (
                  <div key={i} className={`${className} col-md-4 col-sm-12`} style={{ padding: 0 }}>
                    <div className="bannerblock">
                      <a
                        href={secBanners[i]?.url || "#"}
                        className="ishi-customhover-fadeinrotate3D"
                        style={{borderRadius:"0%"}}
                      >
                        <img
                          src={`https://thridle.com/ecom/storage/app/public/banner/${secBanners[i]?.photo}`}
                          alt={`banner-${i}`}
                          className="img-responsive"
                          style={{ width: "100%", height: "auto", borderRadius:"0%" }}
                        />
                      </a>
                    </div>
                  </div>
                ))}

              </>
            )
          )}
        </div>

      </section>



      {/* <!-- ------------------product block---------- --> */}
      <section id="ishiproductsblock" class="ishiproductsblock container">
        <div class="section-header">
          <h3 class="home-title pt">Trending Products</h3>

        </div>

        <div class="tab-content">
          <div id="featured-products-block" class="tab-pane active">
            <div className="block_content">
              {loading ? (
                <OwlCarousel className="owl-theme" {...carouselOptions}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="product-thumb-skeleton">
                      <div className="skeleton-image"></div>
                      <div className="skeleton-title"></div>
                      <div className="skeleton-rating"></div>
                      <div className="skeleton-price"></div>
                    </div>
                  ))}
                </OwlCarousel>
              ) : products.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-search"></i>
                  <p>No products found</p>
                  <button className="browse-btn">Browse Products</button>
                </div>
              ) : (
                <OwlCarousel key={products.length} className="owl-theme" {...carouselOptions}>
                  {products?.map((product) => {
                    const imgBaseUrl =
                      "https://thridle.com/ecom/storage/app/public/product/thumbnail/";
                    const imageArray = JSON.parse(product.images || "[]");
                    const mainImg = product.thumbnail;
                    const hoverImg = imageArray[1]?.image_name;

                    const price = Number(product.unit_price) || 0;
                    const discountValue = Number(product.discount) || 0;
                    const discountType = product.discount_type; // "flat" or "percent"

                    let finalPrice = price;
                    let originalPrice = null;

                    if (discountValue > 0) {
                      if (discountType === "percent") {
                        finalPrice = price - (price * discountValue) / 100;
                      } else if (discountType === "flat") {
                        finalPrice = price - discountValue;
                      }
                      originalPrice = price; // only show when there's a discount
                    }

                    return (
                      <div
                        className="product-thumb" style={{boxShadow:"none"}}
                        onClick={() => navigate(`/product/${product.id}`)}
                        key={product.id}
                      >
                        <div className="product-card">
                          {/* Image with hover effect */}
                          <div className="product-image-container">
                            <img
                              src={`https://thridle.com/ecom/storage/app/public/product/thumbnail/${mainImg}`}
                              alt="product-img"

                            />
                            <img
                              className="product-img-extra change"
                              src={
                                hoverImg
                                  ? `https://thridle.com/ecom/storage/app/public/product/${hoverImg}`
                                  : `https://thridle.com/ecom/storage/app/public/product/thumbnail/${mainImg}`
                              }
                              alt="product-hover"

                            />
                            {discountValue > 0 && (
                              <div className="discount-badge">
                                {discountType === "percent"
                                  ? `${discountValue}% OFF`
                                  : `₹${discountValue} OFF`}
                              </div>
                            )}
                            <button className="quick-view-btn">
                              <i className="fas fa-eye"></i> Quick View
                            </button>
                          </div>

                          {/* Product info */}
                          <div className="product-info">
                            <h4 className="product-title">{product.name}</h4>

                            <div className="rating">
                              {[...Array(5)].map((_, i) => (
                                <i className="fas fa-star" key={i}></i>
                              ))}
                              <span className="rating-count">{product.reviewCount || 0}</span>
                            </div>

                            <div className="price-container">
                              {originalPrice && (
                                <span className="original-price">₹{originalPrice.toFixed(2)}</span>
                              )}
                              <span className="current-price">₹{finalPrice.toFixed(2)}</span>
                            </div>


                          </div>
                        </div>
                      </div>
                    );
                  })}
                </OwlCarousel>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
    .product-thumb {
      padding: 0px;
      cursor: pointer;
      margin-bottom: 10px;
    }
    
    .product-card {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
     
      transition: all 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .product-card:hover {
      transform: translateY(-5px);
    
    }
    
    .product-image-container {
      position: relative;
      height: 280px;
      overflow: hidden;
    }
    
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.5s ease;
    }
    
    .product-image.secondary {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
    }
    
    .product-image-container:hover .primary {
      opacity: 0;
    }
    
    .product-image-container:hover .secondary {
      opacity: 1;
    }
    
    .discount-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: #EB4D7F;
      color: white;
       padding: 3px 5px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
    }
    
    .quick-view-btn {
      position: absolute;
      bottom: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.95);
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      color: #2D3748;
      transition: all 0.3s ease;
      backdrop-filter: blur(5px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .product-image-container:hover .quick-view-btn {
      bottom: 12px;
    }
    
    .quick-view-btn:hover {
      background: #48B7FF;
      color: white;
    }
    
    .product-info {
      padding: 15px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    
    .product-title {
      font-weight: 600;
      font-size: 16px;
      color: #2D3748;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 48px;
    }
    
    .rating {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .rating i {
      color: #FFC107;
      font-size: 12px;
      margin-right: 2px;
    }
    
    .rating-count {
      font-size: 12px;
      color: #718096;
      margin-left: 5px;
    }
    
    .price-container {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 0px;
    }
    
    .original-price {
      text-decoration: line-through;
      color: #A0AEC0;
      font-size: 14px;
    }
    
    .current-price {
      color: #2D3748;
      font-weight: 700;
      font-size: 18px;
    }
    
    .product-actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
    }
    
    .add-to-cart-btn {
      flex-grow: 1;
      background: #48B7FF;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    
    .add-to-cart-btn:hover {
      background: #0074E4;
    }
    
    .wishlist-btn {
      background: #F7FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .wishlist-btn:hover {
      background: #FED7D7;
      border-color: #FEB2B2;
      color: #E53E3E;
    }
    
    /* Skeleton loading */
    .product-thumb-skeleton {
      padding: 10px;
    }
    
    .skeleton-image {
      height: 250px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    
    .skeleton-title {
      height: 20px;
      width: 80%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    
    .skeleton-rating {
      height: 15px;
      width: 60%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    
    .skeleton-price {
      height: 20px;
      width: 40%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
    }
    
    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
    
    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #718096;
    }
    
    .empty-state i {
      font-size: 48px;
      margin-bottom: 15px;
      color: #CBD5E0;
    }
    
    .empty-state p {
      font-size: 18px;
      margin-bottom: 20px;
    }
    
    .browse-btn {
      background: #48B7FF;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .browse-btn:hover {
      background: #0074E4;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      
      .home-title {
        font-size: 24px;
      }
      
      .product-image-container {
        height: 200px;
      }
      
      .product-title {
        font-size: 14px;
      }
      
      .current-price {
        font-size: 16px;
      }
      
      .add-to-cart-btn {
        font-size: 12px;
        padding: 6px 10px;
      }
    }
  `}</style>
      </section>

      {featuredVideoUrl && (
        <section id="ishiproductsblock" className="ishiproductsblock container">
          <h3 className="home-title" style={{ fontWeight: "800" }}>

            Discover
          </h3>

          <div
            className="shorts-wrapper"
            style={{
              padding: "20px",
              borderRadius: "10px",
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "center",
            }}
          >
            <div
              className="shorts-video-container"
              style={{
                position: "relative",
                width: "300px",
                height: "530px",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                backgroundColor: "#000",
              }}
            >
              <iframe
                src={featuredVideoUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              ></iframe>
            </div>
          </div>
        </section>
      )}


      <section id="ishiproductsblock" className="ishiproductsblock container">
        <div className="section-header">
          <h3 className="home-title">Explore</h3>
        </div>

        <div className="prod-block">
          {/* Mobile Category Toggle */}
          <div className="mob-cat-toggle">

          </div>

          {/* Category Tabs for Mobile/Tablet */}
          <div className="category-tabs-container">

            <div className="category-tabs">

              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`category-tab ${selectedCategory === cat.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    fetchProducts(cat.id);
                  }}
                >
                  <span className="tab-name">{cat.name}</span>
                  {/* <span className="tab-count">{cat.count}</span> */}
                </div>
              ))}
            </div>
          </div>

          {/* Left Column - Categories */}
          <div className="cat-sidebar">
            <h3 className="cat-sidebar-title">
              <svg className="cat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19.5V7.5C4 6.94772 4.44772 6.5 5 6.5H9.5C9.76522 6.5 10.0196 6.60536 10.2071 6.79289L12.5 9.5H19C19.5523 9.5 20 9.94772 20 10.5V19.5C20 20.0523 19.5523 20.5 19 20.5H5C4.44772 20.5 4 20.0523 4 19.5Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9.5 6.5V4.5C9.5 3.94772 9.94772 3.5 10.5 3.5H14.5C14.7652 3.5 15.0196 3.60536 15.2071 3.79289L17.5 6.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Shop By Category
            </h3>
            <ul className="cat-list">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className={`cat-list-item ${selectedCategory === cat.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    fetchProducts(cat.id);
                  }}
                >
                  <span className="cat-icon-wrapper">
                    {selectedCategory === cat.id && <span className="active-indicator"></span>}
                  </span>
                  <span className="cat-name">{cat.name}</span>
                  <span className="cat-count">{cat.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Products */}
          <div className={`prod-content ${products?.length === 0 ? "empty" : ""}`}>
            <div className="prod-grid">
              {pPoducts.length > 0 ? (
                pPoducts.map((prod) => {
                  const imgBaseUrl =
                    "https://thridle.com/ecom/storage/app/public/product/thumbnail/";
                  const imageArray = JSON.parse(prod.images || "[]");
                  const mainImg = prod.thumbnail;
                  const hoverImg = imageArray[1]?.image_name;

                  const price = Number(prod.unit_price) || 0;
                  const discountValue = Number(prod.discount) || 0;
                  const discountType = prod.discount_type; // "flat" or "percent"

                  let finalPrice = price;
                  let originalPrice = null;

                  if (discountValue > 0) {
                    if (discountType === "percent") {
                      finalPrice = price - (price * discountValue) / 100;
                    } else if (discountType === "flat") {
                      finalPrice = price - discountValue;
                    }
                    originalPrice = price; // only show when there's a discount
                  }

                  return (
                    <div
                      key={prod.id}
                      className="product-thumb"
                      style={{ marginBottom: "0", boxShadow:"none" }}
                    >
                      <div className="product-card">
                        <Link to={`/product/${prod.id}`} className="prod-link">
                          {/* Image wrapper with hover */}
                          <div className="prod-image-wrapper">
                            <img
                              src={`${imgBaseUrl}${mainImg}`}
                              alt={prod.name}
                              className="prod-image"
                            />
                            <img
                              className="prod-image-hover"
                              src={
                                hoverImg
                                  ? `https://thridle.com/ecom/storage/app/public/product/${hoverImg}`
                                  : `${imgBaseUrl}${mainImg}`
                              }
                              alt="hover-img"
                            />

                            {/* Discount Badge */}
                            {discountValue > 0 && (
                              <div className="prod-badge">
                                {discountType === "percent"
                                  ? `${discountValue}% OFF`
                                  : `₹${discountValue} OFF`}
                              </div>
                            )}

                            {/* Quick view btn */}
                            <button className="quick-btn">
                              <i className="fas fa-eye"></i> Quick View
                            </button>
                          </div>

                          {/* Product Info */}
                          <div className="prod-info">
                            <h4 className="prod-name">{prod.name}</h4>

                            {/* Price */}
                            <div className="price-container">
                              {originalPrice && (
                                <span className="prod-original-price">
                                  ₹{originalPrice.toFixed(2)}
                                </span>
                              )}
                              <span className="prod-price">₹{finalPrice.toFixed(2)}</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>);
                })
              ) : (
                <div className="no-products-container">
                  <div className="no-products">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 6H21L19 16H5L3 6Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 20C16.5523 20 17 19.5523 17 19C17 18.4477 16.5523 18 16 18C15.4477 18 15 18.4477 15 19C15 19.5523 15.4477 20 16 20Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 20C8.55228 20 9 19.5523 9 19C9 18.4477 8.55228 18 8 18C7.44772 18 7 18.4477 7 19C7 19.5523 7.44772 20 8 20Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V6H9V4Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p>No products found</p>
                    <button
                      className="reset-filter-btn"
                      onClick={() => {
                        setSelectedCategory(null);
                        fetchProducts();
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .prod-block {
      display: flex;
      gap: 30px;
      margin: 40px 0;
      position: relative;
      align-items: flex-start;
    }

    .prod-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #fff;
      border-radius: 12px;
      padding: 0;
      width: 100%;
    }

    .prod-content.empty {
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .prod-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 25px;
    }

    /* Category Tabs Container */
    .category-tabs-container {
      width: 100%;
      display: none;
      margin-bottom: 20px;
    }

    /* Category Tabs for Mobile/Tablet */
    .category-tabs {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      background: #fff;
      border-radius: 12px;
      padding: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    
    .category-tab {
      display: inline-flex;
      align-items: center;
      padding: 10px 16px;
      border-radius: 20px;
      background: #f8f9fa;
      color: #4a4a4a;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    
    .category-tab:hover {
      background: #e9ecef;
    }
    
    .category-tab.active {
      background: #EB4D7F;
      color: white;
    }
    
    .tab-count {
      margin-left: 6px;
      background: rgba(255,255,255,0.2);
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.8rem;
    }
    
    .category-tab:not(.active) .tab-count {
      background: #e9ecef;
      color: #777;
    }

    /* Mobile Category Toggle */
    .mob-cat-toggle {
      display: none;
    }

    .mob-cat-btn {
      display: none;
      background: #ffffff;
      border: 1px solid #e9ecef;
      padding: 12px 20px;
      border-radius: 10px;
      font-weight: 600;
      width: 100%;
      margin-bottom: 20px;
      cursor: pointer;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .cat-toggle-icon {
      transition: transform 0.3s ease;
    }

    .mob-cat-btn.active .cat-toggle-icon {
      transform: rotate(180deg);
    }

    /* Categories Sidebar */
    .cat-sidebar {
      flex: 0 0 280px;
      display: flex;
      flex-direction: column;
      border-radius: 12px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      height: auto;
    }

    .cat-sidebar-title {
      background: #EB4D7F;
      color: #fff;
      font-weight: 700;
      padding: 16px 20px;
      font-size: 1.1rem;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cat-icon {
      flex-shrink: 0;
    }

    .cat-list {
      list-style: none;
      margin: 0;
      padding: 10px 0;
      display: flex;
      flex-direction: column;
    }

    .cat-list-item {
      display: flex;
      align-items: center;
      padding: 14px 20px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.95rem;
      color: #4a4a4a;
      transition: all 0.2s ease;
      gap: 12px;
    }

    .cat-list-item:hover {
      background: #f8f9ff;
      color: #EB4D7F;
    }

    .cat-list-item.active {
      background: #f0e6ff;
      color: #EB4D7F;
    }

    .cat-icon-wrapper {
      width: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .active-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #EB4D7F;
    }

    .cat-name {
      flex: 1;
    }

    .cat-count {
      background: #f0f0f0;
      color: #777;
      font-size: 0.8rem;
      padding: 2px 8px;
      border-radius: 10px;
    }

    .cat-list-item.active .cat-count {
      background: #EB4D7F;
      color: white;
    }

    /* Products Grid */
    .product-card {
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      background: white;
      position: relative;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    }

    .prod-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: #ff4444;
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      z-index: 2;
    }

    .prod-link {
      text-decoration: none;
      color: inherit;
      display: block;
    }

    .prod-image-wrapper {
      position: relative;
      height: 280px;
      overflow: hidden;
    }

    .prod-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .prod-image-hover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .product-card:hover .prod-image-hover {
      opacity: 1;
    }

    .product-card:hover .prod-image {
      transform: scale(1.08);
    }

    .quick-btn {
      position: absolute;
      bottom: 15px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.95);
      border: none;
      padding: 10px 16px;
      border-radius: 24px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.9rem;
      color: #333;
      opacity: 0;
      z-index: 3;
    }

    .product-card:hover .quick-btn {
      opacity: 1;
    }

    .quick-btn:hover {
      background: #ffffff;
      transform: translateX(-50%) scale(1.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .prod-info {
      padding: 18px;
    }

    .prod-name {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 10px 0;
      color: #2d3748;
      line-height: 1.4;
      height: 2.8em;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .price-container {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }

    .prod-price {
      font-size: 1.2rem;
      font-weight: 700;
      color: #2d3748;
      margin: 0;
    }

    .prod-original-price {
      font-size: 0.9rem;
      color: #a0a0a0;
      text-decoration: line-through;
      margin: 0;
    }

    /* No Products Container */
    .no-products-container {
      grid-column: 1/-1;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
    }

    /* No Products State */
    .no-products {
      text-align: center;
      padding: 50px 20px;
      color: #718096;
    }

    .no-products svg {
      margin-bottom: 16px;
      color: #CBD5E0;
    }

    .no-products p {
      font-size: 1.1rem;
      margin-bottom: 20px;
    }

    .reset-filter-btn {
      background: #EB4D7F;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .reset-filter-btn:hover {
      background: #7935c5;
      transform: translateY(-2px);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .cat-sidebar {
        flex: 0 0 240px;
      }

      .prod-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      }
    }

    @media (max-width: 900px) {
      .prod-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .prod-block {
        flex-direction: column;
        gap: 20px;
      }

      .mob-cat-toggle {
        display: block;
      }

      .mob-cat-btn {
        display: flex;
      }

      .category-tabs-container {
        display: block;
      }

      .cat-sidebar {
        display: none;
        flex: none;
        width: 100%;
        position: static;
        margin-bottom: 20px;
      }

      .cat-sidebar.active {
        display: block;
      }

      .prod-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 0 15px;
      }
      
      .category-tab {
        padding: 8px 14px;
        font-size: 0.85rem;
      }
      
      .prod-grid {
        grid-template-columns: 1fr;
      }

      .product-card {
        max-width: 100%;
      }
      
      .prod-info {
        padding: 15px;
      }
      
      .prod-name {
        font-size: 0.95rem;
      }
      
      .prod-price {
        font-size: 1.1rem;
      }
    }
  `}</style>
      </section>


      {/* <!-- ------------------gallery block---------- --> */}

      {/* <!-- -------------------manufacture---------- --> */}
      <section id="ishimanufacturerblock" className="clearfix container">
        <div id="manufacturer-carousel" className="owl-carousel owl-theme">
          {brands.map((brand, index) => (
            <div className="item" key={index}>
              <div className="image-container">
                <a href="#">
                  <img
                    src={`https://thridle.com/ecom/storage/app/public/brand/${brand.image}`}
                    alt={brand.image_alt_text || brand.name}
                    title={brand.name}
                    style={{ maxHeight: "80px", objectFit: "contain" }}
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* <!-- -------------------category featured product---------- --> */}

      {/* <!-- -------------------smartblock---------- --> */}
      <section id="smartblog_block" className="smartblog_block container">
        <div className="section-header">
          <h3 className="home-title">Latest Blog</h3>

        </div>

        <div className="block_content">
          {imagesLoaded && blogPosts.length > 0 ? (
            <OwlCarousel
              className="smartblog-carousel owl-carousel"
              {...latestOptions}
            >
              {blogPosts.map((blog) => (
                <div key={blog.id} className="blog-card">
                  <div className="blog-image-container">
                    <div
                      className="blog-image"
                      onClick={() => navigate("/blog-details", { state: blog })}
                      style={{
                        backgroundImage: `url(https://thridle.com/ecom/storage/app/public/blog/image/${blog.image})`
                      }}
                    >
                      <div className="blog-overlay">
                        <span className="read-more">Read Article</span>
                      </div>
                      <div className="blog-meta">
                        <span className="blog-date">
                          <i className="far fa-calendar-alt"></i>
                          {new Date(blog.publish_date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="blog-author">
                          <i className="far fa-user"></i> {blog.writer}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="blog-content">
                    <h4 className="blog-title">
                      <span onClick={() => navigate("/blog-details", { state: blog })}>
                        {blog.title}
                      </span>
                    </h4>

                    <div className="blog-actions">
                      <button
                        className="blog-read-btn"
                        onClick={() => navigate("/blog-details", { state: blog })}
                      >
                        Read More <i className="fas fa-arrow-right"></i>
                      </button>
                      <div className="blog-social">

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </OwlCarousel>
          ) : (
            <div className="blog-skeleton-container">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="blog-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line skeleton-title"></div>
                    <div className="skeleton-line skeleton-meta"></div>
                    <div className="skeleton-line skeleton-text"></div>
                    <div className="skeleton-line skeleton-text"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <style jsx>{`
    .smartblog_block {
      margin: 60px auto;
      padding: 0 15px;
    }
    
   
    
    
   
    
   
    
   
    .blog-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .blog-image-container {
      position: relative;
      height: 220px;
      overflow: hidden;
    }
    
    .blog-image {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      position: relative;
      cursor: pointer;
      transition: transform 0.5s ease;
    }
    
    .blog-card:hover .blog-image {
      transform: scale(1.05);
    }
    
    .blog-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .blog-card:hover .blog-overlay {
      opacity: 1;
    }
    
    .read-more {
      color: white;
      font-weight: 600;
      padding: 8px 16px;
      border: 2px solid white;
      border-radius: 4px;
      transition: all 0.3s;
    }
    
    .blog-card:hover .read-more {
      background: white;
      color: #48B7FF;
    }
    
    .blog-meta {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 12px;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      color: white;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
    }
    
    .blog-meta span {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
   
    .blog-title:hover {
      color: #48B7FF;
    }
    
    .blog-excerpt {
      color: #718096;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 20px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .blog-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;
  margin: 10px;

  display: flex;
  flex-direction: column;
}

.blog-content {
  padding: 20px;
  flex: 1; /* makes content fill available space */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* pushes actions down */
}

.blog-title {
  font-size: 18px;
  font-weight: 700;
  color: #2D3748;
  margin-bottom: 12px;
  line-height: 1.4;
  cursor: pointer;
  transition: color 0.3s;

  /* Clamp title to 2 lines */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 48px; /* reserve space so all cards align */
}

.blog-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto; /* pushes it to bottom */
}

    
    .blog-read-btn {
      background: transparent;
      color: #48B7FF;
      border: none;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      transition: all 0.3s;
      padding: 5px 0;
    }
    
    .blog-read-btn:hover {
      color: #0074E4;
      gap: 8px;
    }
    
    .blog-social {
      display: flex;
      gap: 15px;
    }
    
    .blog-social span {
      color: #A0AEC0;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 3px;
    }
    
    /* Skeleton loading */
    .blog-skeleton-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .blog-skeleton {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }
    
    .skeleton-image {
      height: 220px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    .skeleton-content {
      padding: 20px;
    }
    
    .skeleton-line {
      height: 15px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    
    .skeleton-title {
      height: 20px;
      width: 80%;
      margin-bottom: 15px;
    }
    
    .skeleton-meta {
      height: 12px;
      width: 60%;
      margin-bottom: 20px;
    }
    
    .skeleton-text {
      height: 12px;
    }
    
    .skeleton-text:last-child {
      width: 70%;
    }
    
    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      
      .home-title {
        font-size: 24px;
      }
      
      .blog-skeleton-container {
        grid-template-columns: 1fr;
      }
      
      .blog-meta {
        flex-direction: column;
        gap: 5px;
      }
      
      .blog-actions {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }
      
      .blog-social {
        width: 100%;
        justify-content: space-between;
      }
    }
  `}</style>
      </section>



      {/* <!-- -------------------newsletter---------- --> */}
      {/* <section className="block_newsletter container">
        <div className="row">
          {footerBanners.map((banner, index) => (
            <div
              className="bannerimage bannerblock col-lg-4 col-md-12 col-sm-12 col-xs-12"
              key={index}
            >
              <a
                href={banner.url || "#"}
                className="ishi-customhover-fadeinnormal scale"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`https://thridle.com/ecom/storage/app/public/banner/${banner.photo}`}
                  alt={banner.alt || "footer banner"}
                  className="img-responsive"
                />
              </a>
            </div>
          ))}

          {footerBanners.length >= 2 && (
            <div
              id="newsletter-container"
              className="bannerblock box-content col-lg-4 col-md-12 col-sm-12 col-xs-12"
            >
              <h3 className="home-title">
                <span className="title-icon">
                  <span></span>
                </span>
                Shop Now
              </h3>

              <div className="newsletter_form">
                <form action="#" method="post"></form>
              </div>

              <div className="block-social">
                <div id="block-container">
                  <ul className="social-inner">
                    <li className="facebook">
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <FaFacebook />
                        <span className="socialicon-label">Facebook</span>
                      </a>
                    </li>
                    <li className="twitter">
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <FaTwitter />
                        <span className="socialicon-label">Twitter</span>
                      </a>
                    </li>
                    <li className="rss">
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <FaPinterestP />
                        <span className="socialicon-label">Pinterest</span>
                      </a>
                    </li>
                    <li className="youtube">
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <FaYoutube />
                        <span className="socialicon-label">YouTube</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section> */}

    </div>
  );
};

export default Home;
