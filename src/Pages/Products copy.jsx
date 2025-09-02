import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Products.css";
import api from "../utils/api";
import toast from "react-hot-toast";

const Products = () => {
  const { id } = useParams();


  const mainImageRef = useRef();

  const navigate = useNavigate()
  const [activeThumbIndex, setActiveThumbIndex] = useState(0); // default first
  const [quantity, setQuantity] = useState(1);

  const [product, setProduct] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewStars, setNewReviewStars] = useState(0);

  const [loadingProduct, setLoadingProduct] = useState(true);
  const [variantPrice, setVariantPrice] = useState(product?.unit_price);
  const [cartItems, setCartItems] = useState([]);


  //  const product = location.state;
  // const choiceOptions = JSON.parse(product.choice_options || "[]");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [selectedChoices, setSelectedChoices] = useState({});
  const [choiceOptions, setChoiceOptions] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const iconStyle = (bgColor) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: bgColor,
    color: "white",
    textDecoration: "none",
    transition: "transform 0.2s ease",
    fontSize: "16px",
  });


  const increaseQty = () => {
    if (quantity < 9) setQuantity((prev) => prev + 1); // Max allowed is 9
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleQtyChange = (e) => {
    let val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && val < 10) {
      setQuantity(val);
    }
  };
  useEffect(() => {
    if (product?.choice_options) {
      try {
        const parsed = JSON.parse(product.choice_options);


        const order = ["years", "size", "sm", "md", "lg"];

        const sortedChoices = [...parsed].sort((a, b) => {
          const aIndex = order.findIndex((o) =>
            a.title.toLowerCase().includes(o)
          );
          const bIndex = order.findIndex((o) =>
            b.title.toLowerCase().includes(o)
          );

          return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
        });

        setChoiceOptions(sortedChoices);
      } catch (e) {
        console.error("Invalid choice_options JSON", e);
      }
    }
  }, [product]);

  const fetchProductDetails = async () => {
    setLoadingProduct(true); // start loader
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "productOverview");
    fd.append("productId", id);


    try {
      const response = await api.post("/ecom/products", fd);
      if (response?.data?.success) {
        setProduct(response.data.data?.[0]);
      }
    } catch (error) {
      console.error("Product API Error:", error);
    } finally {
      setLoadingProduct(false); // stop loader
    }
  };

  const fetchProducts = async () => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "getProductDetails");
    fd.append("featured", "yes");

    try {
      const response = await api.post("/ecom/products", fd);

      console.log("product Response", response);
      if (response?.data?.success) {
        setProducts(response.data.data); // assuming `data.data` is the array
      }
    } catch (error) {
      console.error("Product API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const colorOptions = useMemo(() => {
    try {
      return JSON.parse(product.colors || "[]");
    } catch {
      return [];
    }
  }, [product]);

  const parsedChoiceOptions = useMemo(() => {
    try {
      return JSON.parse(product.choice_options || "[]");
    } catch {
      return [];
    }
  }, [product]);

  // Combine sizes into one dropdown
  const sizeOptions = parsedChoiceOptions
    .filter((choice) => /size|sm|md|lg|xl|xxl|xs/i.test(choice.title)) // also allow 'Size'
    .flatMap((choice) =>
      choice.options.map((opt) => ({
        title: choice.title,
        value: opt,
      }))
    );

  const yearsChoices = parsedChoiceOptions.filter((choice) =>
    /year/i.test(choice.title)
  );

  const sizeChoices = parsedChoiceOptions.filter((choice) =>
    /(sm|md|lg|xl|size)/i.test(choice.title)
  );

  const otherChoices = parsedChoiceOptions.filter(
    (choice) => !yearsChoices.includes(choice) && !sizeChoices.includes(choice)
  );

  console.log("product", product);

  const handleChoiceChange = (title, value) => {
    setSelectedChoices((prev) => ({
      ...prev,
      [title]: value,
    }));

    console.log(`🟢 Selected ${title}: ${value}`);
  };

  const BASE_IMAGE_URL =
    "https://thridle.com/ecom/storage/app/public/product/";
  const imageList = useMemo(() => {
    try {
      return JSON.parse(product?.images || "[]");
    } catch {
      return [];
    }
  }, [product]);

  const mainImage = imageList[activeThumbIndex]?.image_name
    ? `${BASE_IMAGE_URL}${imageList[activeThumbIndex].image_name}`
    : "https://via.placeholder.com/300";

  // imageList.forEach((img, i) => {
  //   console.log(`Image ${i + 1}: ${BASE_IMAGE_URL}${img.image_name}`);
  // });
  // const mainImage = imageList[0]?.image_name
  //   ? `${BASE_IMAGE_URL}${imageList[0].image_name}`
  //   : "https://via.placeholder.com/300";

  // const variations = JSON.parse(product.variation || "[]");

  const animateFlyToCart = () => {
    const img = mainImageRef.current;
    const cartIcon = document.getElementById("cart-icon");

    if (!img || !cartIcon) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyImg = img.cloneNode(true);
    flyImg.style.position = "fixed";
    flyImg.style.top = `${imgRect.top}px`;
    flyImg.style.left = `${imgRect.left}px`;
    flyImg.style.width = `${img.offsetWidth}px`;
    flyImg.style.height = `${img.offsetHeight}px`;
    flyImg.style.transition = "all 0.4s ease-in-out";
    flyImg.style.zIndex = "1000";
    flyImg.style.borderRadius = "8px";
    flyImg.style.opacity = "0.85";

    document.body.appendChild(flyImg);

    requestAnimationFrame(() => {
      flyImg.style.top = `${cartRect.top}px`;
      flyImg.style.left = `${cartRect.left}px`;
      flyImg.style.width = "30px";
      flyImg.style.height = "30px";
      flyImg.style.opacity = "0";
    });

    setTimeout(() => {
      document.body.removeChild(flyImg);
    }, 800);
  };


  const AddToCart = async () => {
    animateFlyToCart();
    if (quantity >= 10) {
      toast.error("Quantity must be less than 10");
      return;
    }

    const fd = new FormData();
    fd.append("programType", "addToCart");
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("productId", product.id);
    fd.append("qty", quantity);

    const choiceOptionsParsed = JSON.parse(product.choice_options || "[]");
    const selectedVariantValues = [];
    const selectedHexColor = selectedChoices["Color"] || "";
    const selectedColorName = colorMap[selectedHexColor] || "";

    choiceOptionsParsed.forEach(({ title }) => {
      if (title.toLowerCase() !== "color") {
        const selectedValue = selectedChoices[title];
        if (selectedValue) {
          selectedVariantValues.push(selectedValue);
        }
      }
    });

    const includeColor = selectedColorName && selectedColorName.trim() !== "";
    const variantString = includeColor
      ? [selectedColorName, ...selectedVariantValues].join("-")
      : selectedVariantValues.join("-");

    fd.append("variant", variantString);
    if (includeColor) {
      fd.append("color", selectedColorName);
    }

    choiceOptionsParsed.forEach(({ title, name }) => {
      const selectedValue = selectedChoices[title];
      if (selectedValue) {
        fd.append("variation[]", `${title} | ${selectedValue}`);
        fd.append("choice[]", `${name} | ${selectedValue}`);
      }
    });
    console.log("Submitting form data:");
    for (let pair of fd.entries()) {
      console.log(pair[0], pair[1]); // Logs each key-value pair
    }
    try {
      const response = await api.post("ecom/order", fd);
      console.log("add To cart", response);
      if (response.data.success) {
        toast.success(response.data.message);
        CartDetails();
        window.dispatchEvent(new Event("cart-updated"));
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }

    } catch (error) {
      console.error("Add to Cart Error:", error);
      toast.error("Failed to add to cart.");
    }
  };

  const Review = useCallback(async (prodId) => {
    const fd = new FormData();
    fd.append("programType", "getReviewDetails");
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("productId", prodId);

    setLoadingReviews(true);
    try {
      const response = await api.post("/ecom/review", fd);
      if (response.data?.success) {
        setReviews(response.data.data || []);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Review API Error:", error);
    } finally {
      setLoadingReviews(false);
    }
  }, []);

  const addWishlist = async () => {
    const fd = new FormData();
    fd.append("programType", "addToWishlist");
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("productId", id);

    try {
      const response = await api.post("/ecom/wishlist", fd);
      console.log("wishlist Response:", response);
      if (response.data?.success) {
        toast.success(response.data.message || "Added to wishlist");
        setIsWishlisted(true);
      } else {
        toast.error(response.data.message || "Failed to add");
      }
    } catch (error) {
      console.error("Wishlist API Error:", error);
      toast.error("Something went wrong");
    }
  };

  const removeProduct = async (productId) => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "removeFromWishlist");
    fd.append("wishlistId", productId); // ✅ Corrected key

    try {
      const response = await api.post("/ecom/wishlist", fd);
      console.log("remove", response);
    } catch (error) {
      console.error("Wishlist API Error:", error);
    }
  };


  const getWishlistDetails = async () => {
    const fd = new FormData();
    fd.append("programType", "getWishlistDetails");
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");

    try {
      const response = await api.post("/ecom/wishlist", fd);
      console.log("wishlist list:", response);

      if (response.data?.success && Array.isArray(response.data.data)) {
        const wishlist = response.data.data;
        const exists = wishlist.some((item) => item.id == id); // use `==` to match string/number
        setIsWishlisted(exists);
      }
    } catch (error) {
      console.error("Wishlist API Error:", error);
      toast.error("Something went wrong");
    }
  };



  const addReview = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("programType", "addReviewForProduct");
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("productId", id);
    fd.append("review", newReviewText);
    fd.append("starts", newReviewStars);

    try {
      const response = await api.post("/ecom/review", fd);
      console.log("Review Response:", response);
      if (response.data?.success) {
        setNewReviewText("");
        setNewReviewStars(0);
        setShowReviewForm(false);
        Review(id); // refresh reviews
      }
    } catch (error) {
      console.error("Review API Error:", error);
    }
  };

  useEffect(() => {
    if (product?.id) {
      Review(product.id);
    }
  }, [product?.id, Review]);

  useEffect(() => {
    if (product?.id) {
      CartDetails();
    }
  }, [product?.id]);

  const isInCart = useMemo(() => {
    return cartItems.some((item) => item.product_id == product?.id);
  }, [cartItems, product?.id]);



  useEffect(() => {
    fetchProducts();
    CartDetails();
    if (id) {
      getWishlistDetails();
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const thumbCarouselOptions = {
    items: 4,
    margin: 10,
    nav: true,
    dots: false,
    autoplay: false,
    responsive: {
      0: { items: 2 },
      576: { items: 3 },
      768: { items: 4 },
      992: { items: 4 },
    },
  };

  const options = {
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 5 },
    },
  };
  useEffect(() => {
    if (product?.choice_options) {
      try {
        setChoiceOptions(JSON.parse(product?.choice_options));
      } catch (error) {
        console.error("Invalid choice_options JSON", error);
      }
    }
  }, [product]);

  const [activeTab, setActiveTab] = useState("description");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "tab-review" && product?.id) {
      Review(product.id);
    }
  };
  const colorHexList = useMemo(() => {
    try {
      return JSON.parse(product?.colors || "[]"); // e.g., ["#FFFF00", "#F5F5F5"]
    } catch {
      return [];
    }
  }, [product]);

  const colorNameList = useMemo(() => {
    try {
      return product?.colorNames.split(",").map((name) => name.trim()); // e.g., ["Yellow", "WhiteSmoke"]
    } catch {
      return [];
    }
  }, [product]);

  const colorMap = useMemo(() => {
    const map = {};
    colorHexList.forEach((hex, idx) => {
      map[hex] = colorNameList[idx];
    });
    return map;
  }, [colorHexList, colorNameList]);
  useEffect(() => {
    if (colorHexList.length > 0 && !selectedColor) {
      const firstColor = colorHexList[0];
      setSelectedColor(firstColor);
      setSelectedChoices((prev) => ({
        ...prev,
        Color: firstColor,
      }));
    }
  }, [colorHexList, selectedColor]);

  useEffect(() => {
    if (product?.choice_options) {
      try {
        const parsed = JSON.parse(product.choice_options);

        const order = ["years", "size", "sm", "md", "lg"];

        const sortedChoices = [...parsed].sort((a, b) => {
          const aIndex = order.findIndex((o) =>
            a.title.toLowerCase().includes(o)
          );
          const bIndex = order.findIndex((o) =>
            b.title.toLowerCase().includes(o)
          );

          return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
        });

        setChoiceOptions(sortedChoices);

        // SET default selections for each choice
        const initialSelectedChoices = {};
        sortedChoices.forEach((choice) => {
          if (choice.options.length > 0) {
            initialSelectedChoices[choice.title] = choice.options[0];
          }
        });

        setSelectedChoices(initialSelectedChoices);
      } catch (e) {
        console.error("Invalid choice_options JSON", e);
      }
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;

    try {
      const variations = JSON.parse(product.variation || "[]");

      const selectedHexColor = selectedChoices["Color"] || "";
      const selectedColorName = colorMap[selectedHexColor] || "";

      const selectedVariantValues = [];

      if (selectedColorName) selectedVariantValues.push(selectedColorName);

      choiceOptions.forEach(({ title }) => {
        if (title.toLowerCase() !== "color") {
          const val = selectedChoices[title];
          if (val) selectedVariantValues.push(val);
        }
      });

      const variantKey = selectedVariantValues.join("-"); // e.g., "Yellow-XS"

      const foundVariant = variations.find((v) => v.type === variantKey);
      if (foundVariant) {
        setVariantPrice(foundVariant.price);
      } else {
        setVariantPrice(product.unit_price); // fallback
      }
    } catch (err) {
      console.error("Failed to match variant:", err);
      setVariantPrice(product.unit_price);
    }
  }, [selectedChoices, colorMap, product, choiceOptions]);

  const CartDetails = async () => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "getCartDetails");

    try {
      const response = await api.post("/ecom/order", fd);
      console.log("Cart Response:", response);

      if (response?.data?.success && Array.isArray(response.data.data)) {
        setCartItems(response.data.data); // ✅ Set items
      }
    } catch (error) {
      console.error("Cart Error:", error);
    }
  };

  const [buyNowLoading, setBuyNowLoading] = useState(false);

  const handleBuyNow = async () => {
    setBuyNowLoading(true);
    const success = await AddToCart();
    setBuyNowLoading(false);
    if (success) {
      navigate("/check-out");
    }
  };
  const toggleWishlist = async () => {
    if (isWishlisted) {
      await removeProduct(id); // Use product ID from URL
      setIsWishlisted(false);
      toast.success("Removed from wishlist");
    } else {
      await addWishlist();
    }
  };





  return (
    <div>


      <section id="wrapper" style={{ padding: "30px 0px" }}>
        <div class="container">
          <div class="row">
            <div id="content-wrapper" class="col-12">
              <section id="main">
                <div class="row">
                  {/* Left */}
                  <div
                    className="col-12 col-md-6 mb-4
                    sticky-image-container"
                  >
                    <section class="page-content" id="content">
                      <ul class="product-flags">
                        {/* <li class="product-flag new">New</li> */}
                      </ul>
                      <div className="images-container">
                        <div className="product-cover">
                          <div id="product-zoom" style={{ width: "100%", height: "400px" }}>
                            {loadingProduct ? (
                              <div
                                className="skeleton-main-image"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  background: "#eee",
                                  borderRadius: "8px",
                                }}
                              />
                            ) : (
                              <img
                                className="js-qv-product-cover"
                                ref={mainImageRef}
                                src={mainImage}
                                alt={product?.name}
                                title={product?.name}
                                style={{
                                  width: "100%",
                                  maxHeight: "400px",
                                  objectFit: "contain",
                                  backgroundColor: "#F6F7F9",
                                }}
                              />
                            )}
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="js-qv-mask mask ">
                            {loadingProduct ? (
                              <div className="d-flex gap-3">
                                {[1, 2, 3, 4].map((_, i) => (
                                  <div
                                    key={i}
                                    className="skeleton-thumb"
                                    style={{
                                      width: 100,
                                      height: 100,
                                      background: "#eee",
                                      borderRadius: 4,
                                    }}
                                  />
                                ))}
                              </div>
                            ) : (
                              <OwlCarousel className="owl-theme" {...thumbCarouselOptions}>
                                {imageList.map((imgObj, index) => (
                                  <div
                                    key={index}
                                    className="thumb-container"
                                    onClick={() => setActiveThumbIndex(index)}
                                    style={{ padding: 5, cursor: "pointer" }}
                                  >
                                    <img
                                      className={`thumb js-thumb ${activeThumbIndex === index ? "active-thumb" : ""
                                        }`}
                                      src={`${BASE_IMAGE_URL}${imgObj.image_name}`}
                                      alt={`product-thumb-${index}`}
                                      style={{
                                        // "2px solid #007bff
                                        border: activeThumbIndex === index - 1 ? "1px solid #ccc" : "1px solid #ccc",
                                        borderRadius: 4,
                                        width: "90px",
                                        height: "90px",
                                        objectFit: "cover",
                                        padding: "4px",
                                        background: "#fff",
                                      }}
                                    />
                                  </div>
                                ))}
                              </OwlCarousel>

                            )}
                          </div>
                        </div>
                      </div>

                      <div class="scroll-box-arrows">
                        <i class="material-icons left">& xE314;</i>
                        <i class="material-icons right">& xE315;</i>
                      </div>
                    </section>
                  </div>

                  {/* Right */}
                 <div
  className="col-12 col-md-6 mb-4 productfullldetails"
  style={{
    maxHeight: "100vh",
    overflowY: "scroll",
    paddingLeft: "15px",

    /* Hide scrollbar for Chrome, Safari and Edge */
    scrollbarWidth: "none",            // Firefox
    msOverflowStyle: "none",           // IE 10+
  }}
>

                    {loadingProduct ? (
                      <div>
                        <div
                          className="skeleton skeleton-title"
                          style={{
                            height: 32,
                            width: "80%",
                            background: "#eee",
                            marginBottom: 16,
                          }}
                        />
                        <div
                          className="skeleton skeleton-text"
                          style={{
                            height: 20,
                            width: "90%",
                            background: "#eee",
                            marginBottom: 12,
                          }}
                        />
                        <div
                          className="skeleton skeleton-text"
                          style={{
                            height: 20,
                            width: "75%",
                            background: "#eee",
                            marginBottom: 12,
                          }}
                        />
                        <div
                          className="skeleton skeleton-text"
                          style={{
                            height: 20,
                            width: "60%",
                            background: "#eee",
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <h1 className="h1 product-title">{product?.name}</h1>

                        <div class="product-information">
                          <div id="product-description-short-1">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: product?.details,
                              }}
                            ></p>
                          </div>
                          <div class="product-comments display_comments">
                            <div class="star_content">
                              <div class="star star_on"></div>
                              <div class="star star_on"></div>
                              <div class="star star_on"></div>
                              <div class="star star_on"></div>
                              <div class="star star_on"></div>
                            </div>
                            <div class="comment_advice">
                              {/* <a
                                href=" tab-review"
                                class="read_comment scrollLink"
                              >
                                <i
                                  class="material-icons comments"
                                  aria-hidden="true"
                                >
                                  
                                </i>
                                Read Reviews
                                <a
                                  href=" tab-review"
                                  class="write_comment scrollLink"
                                >
                                  <i
                                    class="material-icons comments"
                                    aria-hidden="true"
                                  >
                                    
                                  </i>
                                  Write Review
                                </a>
                              </a> */}
                            </div>
                            <span>5 review</span>
                          </div>
                          <div class="product-actions">
                            <form
                              action=" "
                              method="post"
                              id="add-to-cart-or-refresh"
                            >
                              <input
                                type="hidden"
                                name="token"
                                value="3d2187fdc78a54510e1e1670c3ff42b0"
                              />
                              <input
                                type="hidden"
                                name="id_product"
                                value="1"
                                id="product_page_product_id"
                              />
                              <input
                                type="hidden"
                                name="id_customization"
                                value="0"
                                id="product_customization_id"
                              />

                              <div
                                style={{
                                  position: "absolute",
                                  top: 1,
                                  right: 10,

                                  cursor: "pointer",
                                }}
                                onClick={toggleWishlist}

                              >
                                <i
                                  className="material-icons"
                                  style={{ color: isWishlisted ? "red" : "#aaa", fontSize: "28px" }}
                                >
                                  {isWishlisted ? "favorite" : "favorite_border"}
                                </i>
                              </div>


                              <div class="product-variants">
                                {/* YEARS FIRST */}
                                {yearsChoices.map((choice, index) => (
                                  <div
                                    key={`years-${index}`}
                                    className="product-variants-item mb-3"
                                  >
                                    <span className="control-label d-block mb-2">
                                      {choice.title}
                                    </span>
                                    <div
                                      className="btn-group-toggle d-flex flex-wrap gap-2"
                                      data-toggle="buttons"
                                    >
                                      {choice.options.map((opt, i) => (
                                        <label
                                          style={{ marginRight: "7px" }}
                                          key={i}
                                          className={`btn btn-outline-primary ${selectedChoices[choice.title] ===
                                            opt
                                            ? "active"
                                            : ""
                                            }`}
                                          onClick={() => {
                                            console.log("Clicked Years", opt);
                                            handleChoiceChange(
                                              choice.title,
                                              opt
                                            );
                                          }}
                                        >
                                          <input
                                            type="radio"
                                            name={`year-${index}`}
                                            value={opt}
                                            checked={
                                              selectedChoices[choice.title] ===
                                              opt
                                            }
                                            readOnly
                                            className="d-none"
                                          />
                                          {opt}
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                ))}

                                {/* THEN SIZES */}
                                {sizeOptions.length > 0 && (
                                  <div className="product-variants-item mb-3">
                                    <span className="control-label d-block mb-2">
                                      Size
                                    </span>
                                    <div
                                      className="btn-group-toggle d-flex flex-wrap gap-2"
                                      data-toggle="buttons"
                                    >
                                      {sizeOptions.map((opt, index) => (
                                        <label
                                          style={{ marginRight: "7px" }}
                                          key={index}
                                          className={`btn btn-outline-dark ${selectedChoices["Size"] ===
                                            opt.value
                                            ? "active"
                                            : ""
                                            }`}
                                          onClick={() => {
                                            console.log(
                                              "Clicked Size",
                                              opt.value
                                            );
                                            handleChoiceChange(
                                              "Size",
                                              opt.value
                                            );
                                          }}
                                        >
                                          <input
                                            type="radio"
                                            name="size"
                                            value={opt.value}
                                            checked={
                                              selectedChoices["Size"] ===
                                              opt.value
                                            }
                                            readOnly
                                            className="d-none"
                                          />
                                          {opt.value.toUpperCase()}
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* THEN ANY OTHER CHOICE FIELDS */}
                                {otherChoices.map((choice, index) => (
                                  <div
                                    key={`other-${index}`}
                                    className="clearfix product-variants-item"
                                  >
                                    <span className="control-label">
                                      {choice.title}
                                    </span>
                                    <select
                                      className="form-control-select"
                                      onChange={(e) =>
                                        handleChoiceChange(
                                          choice.title,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">
                                        Select {choice.title}
                                      </option>
                                      {choice.options.map((opt, i) => (
                                        <option key={i} value={opt}>
                                          {opt}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                ))}

                                {/* COLOR */}
                                <div className="clearfix product-variants-item">
                                  <span className="control-label">Color</span>
                                  <ul
                                    id="group_3"
                                    className="color-selector-list"
                                  >
                                    {colorOptions.map((color, index) => (
                                      <li
                                        key={index}
                                        className="float-xs-left input-container"
                                      >
                                        <label>
                                          <input
                                            className="input-color"
                                            type="radio"
                                            name="group[3]"
                                            value={color}
                                            onChange={() => {
                                              handleChoiceChange(
                                                "Color",
                                                color
                                              );
                                              setSelectedColor(color);
                                            }}
                                            style={{ display: "none" }}
                                          />
                                          <span
                                            className="color"
                                            style={{
                                              backgroundColor: color,
                                              display: "inline-block",
                                              width: "30px",
                                              height: "30px",
                                              borderRadius: "50%",
                                              margin: "5px",
                                              border:
                                                selectedColor === color
                                                  ? "3px solid #48B7FF"
                                                  : "2px solid #ccc",
                                              boxSizing: "border-box",
                                              cursor: "pointer",
                                              position: "relative",
                                            }}
                                          >
                                            {selectedColor === color && (
                                              <span
                                                style={{
                                                  position: "absolute",
                                                  top: "50%",
                                                  left: "50%",
                                                  transform:
                                                    "translate(-50%, -50%)",
                                                  width: "10px",
                                                  height: "10px",
                                                  backgroundColor: "#fff",
                                                  borderRadius: "50%",
                                                }}
                                              />
                                            )}
                                          </span>
                                        </label>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              {/* <section class="product-discounts"></section> */}
                              <div class="product-prices">
                                <div class="product-price h5">
                                  <link href="" />
                                  <meta
                                    itemprop="priceCurrency"
                                    content="USD"
                                  />
                                  <div class="current-price">
                                    <span itemProp="price">₹{variantPrice}</span>

                                  </div>
                                </div>
                              </div>
                              <div className="product-add-to-cart">
                                <div className="product-quantity-selector" style={{ border: "none", padding: "10px 0 10px 0" }}>
                                  <p style={{ fontWeight: "bold", marginBottom: "6px", marginRight: "20px" }}>Qty:</p>
                                  <div
                                    className="quantity-counter"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",

                                      borderRadius: "8px",
                                      overflow: "hidden",
                                      width: "fit-content",
                                    }}
                                  >
                                    <button
                                      onClick={decreaseQty}
                                      style={{
                                        border: "none",
                                        backgroundColor: "#f2f2f2",
                                        padding: "10px 14px",
                                        fontSize: "18px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      −
                                    </button>
                                    <input
                                      type="text"
                                      value={quantity}
                                      onChange={handleQtyChange}
                                      style={{
                                        width: "50px",
                                        textAlign: "center",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "16px",
                                        fontWeight: "500",
                                      }}
                                    />
                                    <button
                                      onClick={increaseQty}
                                      style={{
                                        border: "none",
                                        backgroundColor: "#f2f2f2",
                                        padding: "10px 14px",
                                        fontSize: "18px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                <div className="product-quantity clearfix" style={{ marginTop: "20px" }}>
                                  <div className="add" style={{ display: "flex", gap: "10px" }}>
                                    {isInCart ? (
                                      <button
                                        type="button"
                                        className="btn btn-primary add-to-cart"
                                        onClick={() => navigate("/check-out")}
                                      >
                                        <i className="material-icons">&#xE8CC;</i>
                                        Go to Cart
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        className="btn btn-primary add-to-cart"
                                        onClick={AddToCart}
                                      >
                                        <i className="material-icons shopping-cart">&#xE547;</i>
                                        Add to Cart
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      className="btn btn-success add-to-cart"
                                      disabled={buyNowLoading}
                                      onClick={handleBuyNow}
                                      style={{
                                        backgroundColor: "#EB4D7F",
                                        border: "none",
                                      }}
                                    >
                                      {buyNowLoading ? "Loading..." : (
                                        <>
                                          <i className="material-icons shopping-cart">&#xE547;</i>
                                          Buy Now
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div
                                className="product-additional-info"
                                style={{
                                  backgroundColor: "#f9f9fc",
                                  padding: "16px 20px",
                                  borderRadius: "12px",
                                  boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
                                  marginTop: "20px",
                                }}
                              >
                                <div className="social-sharing">
                                  <span style={{ fontWeight: "600", fontSize: "16px", marginRight: "12px" }}>
                                    Share
                                  </span>
                                  <ul
                                    style={{
                                      display: "flex",
                                      gap: "14px",
                                      paddingLeft: 0,
                                      listStyle: "none",
                                      margin: 0,
                                    }}
                                  >
                                    {/* Facebook */}
                                    <li>
                                      <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Share on Facebook"
                                        style={iconStyle("#3b5998")}
                                      >
                                        <i className="fab fa-facebook-f"></i>
                                      </a>
                                    </li>

                                    {/* Instagram */}
                                    <li>
                                      <a
                                        href="https://www.instagram.com/thridle/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="View on Instagram"
                                        style={iconStyle("#E1306C")}
                                      >
                                        <i className="fab fa-instagram"></i>
                                      </a>
                                    </li>

                                    {/* WhatsApp */}
                                    <li>
                                      <a
                                        href={`https://wa.me/?text=${encodeURIComponent(
                                          "Check this out: " + window.location.href
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Share on WhatsApp"
                                        style={iconStyle("#25D366")}
                                      >
                                        <i className="fab fa-whatsapp"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div id="block-reassurance">
                                <ul>
                                  <li>
                                    <div class="block-reassurance-item">
                                      <img
                                        src="../../assets/images/block-reassurance/1.png"
                                        alt="Security policy (edit with Customer reassurance module)"
                                      />
                                      &nbsp;
                                      <span class="h6">
                                        Security policy (edit with Customer
                                        reassurance module)
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div class="block-reassurance-item">
                                      <img
                                        src="../../assets/images/block-reassurance/2.png"
                                        alt="Delivery policy (edit with Customer reassurance module)"
                                      />
                                      &nbsp;
                                      <span class="h6">
                                        Delivery policy (edit with Customer
                                        reassurance module)
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div class="block-reassurance-item">
                                      <img
                                        src="../../assets/images/block-reassurance/3.png"
                                        alt="Return policy (edit with Customer reassurance module)"
                                      />
                                      &nbsp;
                                      <span class="h6">
                                        Return policy (edit with Customer
                                        reassurance module)
                                      </span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </form>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div class="row product-block-information">
                  <div class="col-12 product-details">
                    <div className="tabs">
                      <ul className="nav nav-tabs" role="tablist">
                        <li
                          className={`nav-item ${activeTab === "description" ? "active" : ""
                            }`}
                        >
                          <a
                            className={`nav-link ${activeTab === "description" ? "active" : ""
                              }`}
                            role="tab"
                            onClick={() => handleTabClick("description")}
                          >
                            Description
                          </a>
                        </li>

                        <li
                          className={`nav-item ${activeTab === "product-details" ? "active" : ""
                            }`}
                        >
                          <a
                            className={`nav-link ${activeTab === "product-details" ? "active" : ""
                              }`}
                            role="tab"
                            onClick={() => handleTabClick("product-details")}
                          >
                            {activeTab === "product-details"
                              ? "Products Details"
                              : "Product Details"}
                          </a>
                        </li>

                        <li
                          className={`nav-item ${activeTab === "tab-review" ? "active" : ""
                            }`}
                        >
                          <a
                            className={`nav-link ${activeTab === "tab-review" ? "active" : ""
                              }`}
                            role="tab"
                            onClick={() => handleTabClick("tab-review")}
                          >
                            Reviews
                          </a>
                        </li>
                      </ul>

                      <div className="tab-content" id="tab-content">
                        <div
                          className={`tab-pane fade ${activeTab === "description" ? "show active" : ""
                            }`}
                          id="description"
                          role="tabpanel"
                        >
                          <div className="product-description">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: product?.details,
                              }}
                            ></p>
                          </div>
                        </div>

                        <div
                          className={`tab-pane fade ${activeTab === "product-details" ? "show active" : ""
                            }`}
                          id="product-details"
                          role="tabpanel"
                        >
                          <div
                            className={`tab-pane fade ${activeTab === "product-details"
                              ? "show active"
                              : ""
                              }`}
                            id="product-details"
                            role="tabpanel"
                          >
                            <div className="container py-0">

                              <div
                                className="p-4 rounded"
                                style={{
                                  backgroundColor: "#fdfdfd",
                                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                                  border: "1px solid #eee",
                                }}
                              >
                                <h5
                                  className="mb-4 pb-2 fw-semibold border-bottom"
                                  style={{ fontSize: "1.2rem" }}
                                >
                                  Product Information
                                </h5>

                                <div className="row gy-4">
                                  <div className="col-md-6">
                                    <div className="d-flex justify-content-between text-muted">
                                      <span>Brand</span>
                                      <span className="text-dark">
                                        {product?.brandName || "—"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="col-md-6">
                                    <div className="d-flex justify-content-between text-muted">
                                      <span>Category</span>
                                      <span className="text-dark">
                                        {product?.categoryName || "—"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="col-md-6">
                                    <div className="d-flex justify-content-between text-muted">
                                      <span>Subcategory</span>
                                      <span className="text-dark">
                                        {product?.subCategoryName || "—"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="col-md-6">
                                    <div className="d-flex justify-content-between text-muted">
                                      <span>Product Code</span>
                                      <span className="text-dark">
                                        {product?.code || "—"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="col-md-6">
                                    <div className="d-flex justify-content-between text-muted">
                                      <span>Unit Price</span>
                                      <span className="fw-semibold text-success">
                                        ₹{product?.unit_price || "—"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="col-md-6">
                                    <div className="d-flex justify-content-between text-muted">
                                      <span>Stock</span>
                                      <span
                                        className={`fw-semibold ${product?.current_stock > 0
                                          ? "text-success"
                                          : "text-danger"
                                          }`}
                                      >
                                        {product?.current_stock > 0
                                          ? `${product?.current_stock} in stock`
                                          : "Out of stock"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="col-md-6">
                                    <div className="d-flex justify-content-between text-muted">
                                      <span>Unit</span>
                                      <span className="text-dark">
                                        {product?.unit || "—"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="col-md-6">
                                    <div className="d-flex justify-content-between text-muted">
                                      <span>Colors</span>
                                      <span className="text-dark">
                                        {product?.colorNames || "—"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`tab-pane fade ${activeTab === "tab-review" ? "show active" : ""
                            }`}
                          id="tab-review"
                          role="tabpanel"
                        >
                          {activeTab === "tab-review" && (
                            <div
                              className="tab-pane fade show active"
                              id="tab-review"
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <button
                                  className="btn btn-outline-primary mb-3"
                                  onClick={() =>
                                    setShowReviewForm(!showReviewForm)
                                  }
                                >
                                  {showReviewForm ? "Cancel" : "Add Review"}
                                </button>
                              </div>

                              {showReviewForm && (
                                <form
                                  onSubmit={addReview}
                                  className="border rounded p-3 bg-white"
                                >
                                  <div className="form-group mb-3">
                                    <label className="form-label">
                                      Your Rating:
                                    </label>
                                    <div className="d-flex gap-2">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                          key={star}
                                          style={{
                                            fontSize: "24px",
                                            color:
                                              star <= newReviewStars
                                                ? "#f5c518"
                                                : "#ccc",
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            setNewReviewStars(star)
                                          }
                                        >
                                          ★
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="form-group mb-3">
                                    <label className="form-label">
                                      Your Review:
                                    </label>
                                    <textarea
                                      className="form-control"
                                      value={newReviewText}
                                      onChange={(e) =>
                                        setNewReviewText(e.target.value)
                                      }
                                      rows={3}
                                      placeholder="Write your review here..."
                                      required
                                    />
                                  </div>

                                  <button
                                    className="btn btn-success"
                                    type="submit"
                                    disabled={!newReviewStars || !newReviewText}
                                  >
                                    Submit Review
                                  </button>
                                </form>
                              )}

                              <hr />

                              <h4 className="mb-3">Customer Reviews</h4>

                              {loadingReviews ? (
                                <p>Loading reviews...</p>
                              ) : reviews.length > 0 ? (
                                reviews.map((rev, i) => (
                                  <div
                                    key={i}
                                    className="border  rounded shadow-sm bg-light"
                                  >
                                    <div className="d-flex justify-content-between">
                                      <strong>{rev.customerName}</strong>
                                      <span className="text-warning">
                                        {"⭐".repeat(rev.rating)}{" "}
                                        <span style={{ color: "#999" }}>
                                          ({rev.rating})
                                        </span>
                                      </span>
                                    </div>
                                    <p className="mb-0">{rev.comment}</p>
                                  </div>
                                ))
                              ) : (
                                <p>No reviews found.</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <section
                    class="product-accessories-block clearfix"
                    style={{ marginBottom: "0" }}
                  >
                    <h3 class="home-title">
                      <span class="title-icon">
                        <span></span>
                      </span>
                      You might also like
                    </h3>
                    <div class="block_content">
                      <OwlCarousel
                        className="owl-theme"
                        {...options}
                        id="ishi-product-accessories"
                      >
                        {loading
                          ? [...Array(4)].map((_, idx) => (
                            <div
                              key={idx}
                              className="product-thumb"
                              style={{ padding: "10px" }}
                            >
                              <div
                                className="item"
                                style={{
                                  border: "1px solid #eee",
                                  borderRadius: "10px",
                                  padding: "10px",
                                  height: "100%",
                                  minHeight: "400px",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  backgroundColor: "#fff",
                                }}
                              >
                                <div
                                  style={{
                                    height: "200px",
                                    backgroundColor: "#eee",
                                    borderRadius: "6px",
                                  }}
                                />
                                <div
                                  style={{
                                    marginTop: "10px",
                                    height: "40px",
                                    backgroundColor: "#eee",
                                    borderRadius: "4px",
                                  }}
                                />
                                <div
                                  style={{
                                    marginTop: "8px",
                                    height: "20px",
                                    width: "80%",
                                    backgroundColor: "#eee",
                                    borderRadius: "4px",
                                  }}
                                />
                                <div
                                  style={{
                                    marginTop: "8px",
                                    height: "20px",
                                    width: "60%",
                                    backgroundColor: "#eee",
                                    borderRadius: "4px",
                                  }}
                                />
                                <div
                                  style={{
                                    marginTop: "12px",
                                    height: "35px",
                                    backgroundColor: "#ddd",
                                    borderRadius: "4px",
                                  }}
                                />
                              </div>
                            </div>
                          ))
                          : products.map((product, idx) => {
                            const imageArray = JSON.parse(
                              product.images || "[]"
                            );
                            const mainImg = imageArray[0]?.image_name || "";
                            const hoverImg =
                              imageArray[1]?.image_name || mainImg;

                            return (
                              <div key={idx} className="product-thumb" style={{ padding: "0" }}>
                                <div className="item">
                                  <div className="product-desc">
                                    <div
                                      className="product-title"
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                        color: "#333",
                                        overflow: "hidden",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        minHeight: "40px",
                                      }}
                                    >
                                      <a
                                        href={`/product/${product.id}`}
                                        style={{
                                          color: "inherit",
                                          textDecoration: "none",
                                        }}
                                      >
                                        {product.name}
                                      </a>
                                    </div>
                                    <div className="product-comments">
                                      <div className="star_content">
                                        {[...Array(5)].map((_, i) => (
                                          <div
                                            key={i}
                                            className="star star_on"
                                          ></div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className="image"
                                    style={{
                                      height: "200px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <a
                                      href={`/product/${product.id}`}
                                      className="thumbnail product-thumbnail"
                                    >
                                      <img
                                        src={`https://thridle.com/ecom/storage/app/public/product/${mainImg}`}
                                        alt={product.name}
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                        }}
                                      />
                                      {hoverImg && hoverImg !== mainImg && (
                                        <img
                                          className="product-img-extra change"
                                          src={`https://thridle.com/ecom/storage/app/public/product/${hoverImg}`}
                                          alt={product.name}
                                          style={{ display: "none" }}
                                        />
                                      )}
                                    </a>
                                  </div>

                                  <div className="caption" style={{ backgroundColor: "#48B7FF" }}>
                                    <p
                                      className="description"
                                      style={{
                                        fontSize: "0.85rem",
                                        color: "#666",
                                        height: "45px",
                                        overflow: "hidden",
                                      }}
                                    >
                                      {product.details
                                        ?.replace(/<[^>]+>/g, "")
                                        .slice(0, 80)}
                                      ...
                                    </p>
                                    <p className="price" >
                                      <span className="price-sale" style={{ color: "#fff" }}>
                                        ₹{product.unit_price}
                                      </span>
                                    </p>
                                    <div className="btn-cart">
                                      <a className="button">
                                        <i className="fa fa-shopping-cart"></i>
                                        <span className="lblcart">
                                          Add to cart
                                        </span>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </OwlCarousel>
                    </div>
                  </section>

                  {/* <section id="ishispecialproducts">
                  <h3 class="home-title"><span class="title-icon"><span></span></span>Special Products</h3>
                  <div class="block_content">
                    <div id="ishispecialproducts-carousel" class="owl-carousel products">
                      <div class="product-thumb">
                        <div class="item">
                          <div class="product-desc">
                            <div class="product-title"><a href=" ">Shake Spin Lion</a></div>
                            <div class="product-comments">  
                              <div class="star_content">
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                              </div>
                            </div>
                          </div>
                          <div class="image">
                            <a href=" " class="thumbnail product-thumbnail">
                              <img src="assets/images/product/1.jpg" alt="product-img" />
                              <img class="product-img-extra change" alt="product-img" src="assets/images/product/2.jpg" />
                            </a>
                            <div class="product-flags">
                              <div class="sale">Sale</div>
                            </div>
                          </div>
                          <div class="caption">    
                            <p class="description">
                            The 30-inch Apple Cinema HD Display delivers an amazing 2560 x 1600 pixel resolution. Designed sp..</p>
                            <p class="price">
                              <span class="regular price-old">$55.00</span> 
                              <span class="price-discount">9%</span> 
                              <span class="price-sale">$50.00 </span>
                            </p>
                            <div class="btn-cart">
                              <a data-button-action="add-to-cart" class="button">
                                <i class="fa fa-shopping-cart"></i> 
                                <span class="lblcart">Add to cart</span>
                              </a>
                            </div>                         
                            <div class="button-group">  
                              <div class="btn-quickview"> 
                                <a class="quickbox" href=" ">
                                  <svg xmlns="http://www.w3.org/2000/svg" style={{display:"none"}}>
                                    <symbol id="eye-open" viewBox="0 0 1190 1190"><title>eye-open</title><path d="M505.918,236.117c-26.651-43.587-62.485-78.609-107.497-105.065c-45.015-26.457-92.549-39.687-142.608-39.687 c-50.059,0-97.595,13.225-142.61,39.687C68.187,157.508,32.355,192.53,5.708,236.117C1.903,242.778,0,249.345,0,255.818 c0,6.473,1.903,13.04,5.708,19.699c26.647,43.589,62.479,78.614,107.495,105.064c45.015,26.46,92.551,39.68,142.61,39.68 c50.06,0,97.594-13.176,142.608-39.536c45.012-26.361,80.852-61.432,107.497-105.208c3.806-6.659,5.708-13.223,5.708-19.699 C511.626,249.345,509.724,242.778,505.918,236.117z M194.568,158.03c17.034-17.034,37.447-25.554,61.242-25.554 c3.805,0,7.043,1.336,9.709,3.999c2.662,2.664,4,5.901,4,9.707c0,3.809-1.338,7.044-3.994,9.704 c-2.662,2.667-5.902,3.999-9.708,3.999c-16.368,0-30.362,5.808-41.971,17.416c-11.613,11.615-17.416,25.603-17.416,41.971 c0,3.811-1.336,7.044-3.999,9.71c-2.667,2.668-5.901,3.999-9.707,3.999c-3.809,0-7.044-1.334-9.71-3.999 c-2.667-2.666-3.999-5.903-3.999-9.71C169.015,195.482,177.535,175.065,194.568,158.03z M379.867,349.04 c-38.164,23.12-79.514,34.687-124.054,34.687c-44.539,0-85.889-11.56-124.051-34.687s-69.901-54.2-95.215-93.222 c28.931-44.921,65.19-78.518,108.777-100.783c-11.61,19.792-17.417,41.207-17.417,64.236c0,35.216,12.517,65.329,37.544,90.362 s55.151,37.544,90.362,37.544c35.214,0,65.329-12.518,90.362-37.544s37.545-55.146,37.545-90.362 c0-23.029-5.808-44.447-17.419-64.236c43.585,22.265,79.846,55.865,108.776,100.783C449.767,294.84,418.031,325.913,379.867,349.04 z"/></symbol>
                                  </svg>
                                  <svg class="icon" viewBox="0 0 30 30"><use  href=" eye-open" x="28%" y="28%"></use></svg>
                                  <span class="lblcart">Quick View</span>
                                </a>
                              </div>                  
                              <div class="btn-wishlist">
                                <a href=" ">
                                  <svg xmlns="http://www.w3.org/2000/svg" style={{display:"none"}}>
                                    <symbol id="heart-shape-outline" viewBox="0 0 1400 1400"><title>heart-shape-outline</title><path d="M492.719,166.008c0-73.486-59.573-133.056-133.059-133.056c-47.985,0-89.891,25.484-113.302,63.569c-23.408-38.085-65.332-63.569-113.316-63.569C59.556,32.952,0,92.522,0,166.008c0,40.009,17.729,75.803,45.671,100.178l188.545,188.553c3.22,3.22,7.587,5.029,12.142,5.029c4.555,0,8.922-1.809,12.142-5.029l188.545-188.553C474.988,241.811,492.719,206.017,492.719,166.008z"/></symbol>
                                  </svg>
                                  <svg class="icon" viewBox="0 0 30 30"><use  href=" heart-shape-outline" x="32%" y="33%"></use></svg>
                                </a>
                              </div>
                            </div> 
                          </div> 
                        </div>
                      </div>
                      <div class="product-thumb">
                        <div class="item">
                          <div class="product-desc">
                            <div class="product-title"><a href=" ">Sensory Sweet</a></div>
                            <div class="product-comments">  
                              <div class="star_content">
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                              </div>
                            </div>
                          </div>
                          <div class="image">
                            <a href=" " class="thumbnail product-thumbnail">
                              <img src="assets/images/product/8.jpg" alt="product-img" /> 
                              <img class="product-img-extra change" alt="product-img" src="assets/images/product/9.jpg" />
                            </a>
                            <div class="product-flags">
                              <div class="sale">Sale</div>
                            </div>
                          </div>
                          <div class="caption"> 
                            <p class="description">
                            The 30-inch Apple Cinema HD Display delivers an amazing 2560 x 1600 pixel resolution. Designed sp..</p>
                            <p class="price">
                              <span class="regular price-old">$30.00</span> 
                              <span class="price-discount">16%</span> 
                              <span class="price-sale">$25.00 </span>
                            </p>
                            <div class="btn-cart">
                              <a data-button-action="add-to-cart" class="button">
                                <i class="fa fa-shopping-cart"></i> 
                                <span class="lblcart">Add to cart</span>
                              </a>
                            </div>                            
                            <div class="button-group">  
                              <div class="btn-quickview"> 
                                <a class="quickbox" href=" ">
                                  <svg xmlns="http://www.w3.org/2000/svg" style={{display:"none"}}>
                                    <symbol id="eye-open" viewBox="0 0 1190 1190"><title>eye-open</title><path d="M505.918,236.117c-26.651-43.587-62.485-78.609-107.497-105.065c-45.015-26.457-92.549-39.687-142.608-39.687 c-50.059,0-97.595,13.225-142.61,39.687C68.187,157.508,32.355,192.53,5.708,236.117C1.903,242.778,0,249.345,0,255.818 c0,6.473,1.903,13.04,5.708,19.699c26.647,43.589,62.479,78.614,107.495,105.064c45.015,26.46,92.551,39.68,142.61,39.68 c50.06,0,97.594-13.176,142.608-39.536c45.012-26.361,80.852-61.432,107.497-105.208c3.806-6.659,5.708-13.223,5.708-19.699 C511.626,249.345,509.724,242.778,505.918,236.117z M194.568,158.03c17.034-17.034,37.447-25.554,61.242-25.554 c3.805,0,7.043,1.336,9.709,3.999c2.662,2.664,4,5.901,4,9.707c0,3.809-1.338,7.044-3.994,9.704 c-2.662,2.667-5.902,3.999-9.708,3.999c-16.368,0-30.362,5.808-41.971,17.416c-11.613,11.615-17.416,25.603-17.416,41.971 c0,3.811-1.336,7.044-3.999,9.71c-2.667,2.668-5.901,3.999-9.707,3.999c-3.809,0-7.044-1.334-9.71-3.999 c-2.667-2.666-3.999-5.903-3.999-9.71C169.015,195.482,177.535,175.065,194.568,158.03z M379.867,349.04 c-38.164,23.12-79.514,34.687-124.054,34.687c-44.539,0-85.889-11.56-124.051-34.687s-69.901-54.2-95.215-93.222 c28.931-44.921,65.19-78.518,108.777-100.783c-11.61,19.792-17.417,41.207-17.417,64.236c0,35.216,12.517,65.329,37.544,90.362 s55.151,37.544,90.362,37.544c35.214,0,65.329-12.518,90.362-37.544s37.545-55.146,37.545-90.362 c0-23.029-5.808-44.447-17.419-64.236c43.585,22.265,79.846,55.865,108.776,100.783C449.767,294.84,418.031,325.913,379.867,349.04 z"/></symbol>
                                  </svg>
                                  <svg class="icon" viewBox="0 0 30 30"><use  href=" eye-open" x="28%" y="28%"></use></svg>
                                  <span class="lblcart">Quick View</span>
                                </a>
                              </div>                  
                              <div class="btn-wishlist">
                                <a href=" ">
                                  <svg xmlns="http://www.w3.org/2000/svg" style={{display:"none"}}>
                                    <symbol id="heart-shape-outline" viewBox="0 0 1400 1400"><title>heart-shape-outline</title><path d="M492.719,166.008c0-73.486-59.573-133.056-133.059-133.056c-47.985,0-89.891,25.484-113.302,63.569c-23.408-38.085-65.332-63.569-113.316-63.569C59.556,32.952,0,92.522,0,166.008c0,40.009,17.729,75.803,45.671,100.178l188.545,188.553c3.22,3.22,7.587,5.029,12.142,5.029c4.555,0,8.922-1.809,12.142-5.029l188.545-188.553C474.988,241.811,492.719,206.017,492.719,166.008z"/></symbol>
                                  </svg>
                                  <svg class="icon" viewBox="0 0 30 30"><use  href=" heart-shape-outline" x="32%" y="33%"></use></svg>
                                </a>
                              </div>
                            </div> 
                          </div> 
                        </div>
                      </div>
                      <div class="product-thumb">
                        <div class="item">
                          <div class="product-desc">
                            <div class="product-title"><a href=" ">Link 'n Go  Pack</a></div>
                            <div class="product-comments">  
                              <div class="star_content">
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                              </div>
                            </div>
                          </div>
                          <div class="image">
                            <a href=" " class="thumbnail product-thumbnail">
                              <img src="assets/images/product/14.jpg" alt="product-img" />
                              <img class="product-img-extra change" alt="product-img" src="assets/images/product/15.jpg" />
                            </a>
                            <div class="product-flags">
                              <div class="sale">Sale</div>
                            </div>
                          </div>
                          <div class="caption">  
                            <p class="description">
                            The 30-inch Apple Cinema HD Display delivers an amazing 2560 x 1600 pixel resolution. Designed sp..</p>
                            <p class="price">
                              <span class="regular price-old">$20.00</span> 
                              <span class="price-discount">25%</span> 
                              <span class="price-sale">$15.00 </span>
                            </p>
                            <div class="btn-cart">
                              <a data-button-action="add-to-cart" class="button sold-out">
                                <i class="fa fa-shopping-cart"></i> 
                                <span class="lblcart">Add to cart</span>
                              </a>
                            </div>                           
                            <div class="button-group">  
                              <div class="btn-quickview"> 
                                <a class="quickbox" href=" ">
                                  <svg xmlns="http://www.w3.org/2000/svg" style={{display:"none"}}>
                                    <symbol id="eye-open" viewBox="0 0 1190 1190"><title>eye-open</title><path d="M505.918,236.117c-26.651-43.587-62.485-78.609-107.497-105.065c-45.015-26.457-92.549-39.687-142.608-39.687 c-50.059,0-97.595,13.225-142.61,39.687C68.187,157.508,32.355,192.53,5.708,236.117C1.903,242.778,0,249.345,0,255.818 c0,6.473,1.903,13.04,5.708,19.699c26.647,43.589,62.479,78.614,107.495,105.064c45.015,26.46,92.551,39.68,142.61,39.68 c50.06,0,97.594-13.176,142.608-39.536c45.012-26.361,80.852-61.432,107.497-105.208c3.806-6.659,5.708-13.223,5.708-19.699 C511.626,249.345,509.724,242.778,505.918,236.117z M194.568,158.03c17.034-17.034,37.447-25.554,61.242-25.554 c3.805,0,7.043,1.336,9.709,3.999c2.662,2.664,4,5.901,4,9.707c0,3.809-1.338,7.044-3.994,9.704 c-2.662,2.667-5.902,3.999-9.708,3.999c-16.368,0-30.362,5.808-41.971,17.416c-11.613,11.615-17.416,25.603-17.416,41.971 c0,3.811-1.336,7.044-3.999,9.71c-2.667,2.668-5.901,3.999-9.707,3.999c-3.809,0-7.044-1.334-9.71-3.999 c-2.667-2.666-3.999-5.903-3.999-9.71C169.015,195.482,177.535,175.065,194.568,158.03z M379.867,349.04 c-38.164,23.12-79.514,34.687-124.054,34.687c-44.539,0-85.889-11.56-124.051-34.687s-69.901-54.2-95.215-93.222 c28.931-44.921,65.19-78.518,108.777-100.783c-11.61,19.792-17.417,41.207-17.417,64.236c0,35.216,12.517,65.329,37.544,90.362 s55.151,37.544,90.362,37.544c35.214,0,65.329-12.518,90.362-37.544s37.545-55.146,37.545-90.362 c0-23.029-5.808-44.447-17.419-64.236c43.585,22.265,79.846,55.865,108.776,100.783C449.767,294.84,418.031,325.913,379.867,349.04 z"/></symbol>
                                  </svg>
                                  <svg class="icon" viewBox="0 0 30 30"><use  href=" eye-open" x="28%" y="28%"></use></svg>
                                  <span class="lblcart">Quick View</span>
                                </a>
                              </div>                  
                              <div class="btn-wishlist">
                                <a href=" ">
                                  <svg xmlns="http://www.w3.org/2000/svg" style={{display:"none"}}>
                                    <symbol id="heart-shape-outline" viewBox="0 0 1400 1400"><title>heart-shape-outline</title><path d="M492.719,166.008c0-73.486-59.573-133.056-133.059-133.056c-47.985,0-89.891,25.484-113.302,63.569c-23.408-38.085-65.332-63.569-113.316-63.569C59.556,32.952,0,92.522,0,166.008c0,40.009,17.729,75.803,45.671,100.178l188.545,188.553c3.22,3.22,7.587,5.029,12.142,5.029c4.555,0,8.922-1.809,12.142-5.029l188.545-188.553C474.988,241.811,492.719,206.017,492.719,166.008z"/></symbol>
                                  </svg>
                                  <svg class="icon" viewBox="0 0 30 30"><use  href=" heart-shape-outline" x="32%" y="33%"></use></svg>
                                </a>
                              </div>
                            </div> 
                          </div> 
                        </div>
                      </div>
                      <div class="product-thumb">
                        <div class="item">
                          <div class="product-desc">
                            <div class="product-title"><a href=" ">Critter Teddy</a></div>
                            <div class="product-comments">  
                              <div class="star_content">
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                              </div>
                            </div>
                          </div>
                          <div class="image">
                            <a href=" " class="thumbnail product-thumbnail">
                              <img src="assets/images/product/5.jpg" alt="product-img" />
                              <img class="product-img-extra change" alt="product-img" src="assets/images/product/6.jpg"/>
                            </a>
                            <div class="product-flags">
                              <div class="sale">Sale</div>
                            </div>
                          </div>
                          <div class="caption">  
                            <p class="description">
                            The 30-inch Apple Cinema HD Display delivers an amazing 2560 x 1600 pixel resolution. Designed sp..</p>
                            <p class="price">
                              <span class="regular price-old">$35.00</span> 
                              <span class="price-discount">14%</span> 
                              <span class="price-sale">$30.00 </span>
                            </p>
                            <div class="btn-cart">
                              <a data-button-action="add-to-cart" class="button">
                                <i class="fa fa-shopping-cart"></i> 
                                <span class="lblcart">Add to cart</span>
                              </a>
                            </div>                           
                            <div class="button-group">  
                              <div class="btn-quickview"> 
                                <a class="quickbox" href=" ">
                                  <svg xmlns="http://www.w3.org/2000/svg" style={{display:"none"}}>
                                    <symbol id="eye-open" viewBox="0 0 1190 1190"><title>eye-open</title><path d="M505.918,236.117c-26.651-43.587-62.485-78.609-107.497-105.065c-45.015-26.457-92.549-39.687-142.608-39.687 c-50.059,0-97.595,13.225-142.61,39.687C68.187,157.508,32.355,192.53,5.708,236.117C1.903,242.778,0,249.345,0,255.818 c0,6.473,1.903,13.04,5.708,19.699c26.647,43.589,62.479,78.614,107.495,105.064c45.015,26.46,92.551,39.68,142.61,39.68 c50.06,0,97.594-13.176,142.608-39.536c45.012-26.361,80.852-61.432,107.497-105.208c3.806-6.659,5.708-13.223,5.708-19.699 C511.626,249.345,509.724,242.778,505.918,236.117z M194.568,158.03c17.034-17.034,37.447-25.554,61.242-25.554 c3.805,0,7.043,1.336,9.709,3.999c2.662,2.664,4,5.901,4,9.707c0,3.809-1.338,7.044-3.994,9.704 c-2.662,2.667-5.902,3.999-9.708,3.999c-16.368,0-30.362,5.808-41.971,17.416c-11.613,11.615-17.416,25.603-17.416,41.971 c0,3.811-1.336,7.044-3.999,9.71c-2.667,2.668-5.901,3.999-9.707,3.999c-3.809,0-7.044-1.334-9.71-3.999 c-2.667-2.666-3.999-5.903-3.999-9.71C169.015,195.482,177.535,175.065,194.568,158.03z M379.867,349.04 c-38.164,23.12-79.514,34.687-124.054,34.687c-44.539,0-85.889-11.56-124.051-34.687s-69.901-54.2-95.215-93.222 c28.931-44.921,65.19-78.518,108.777-100.783c-11.61,19.792-17.417,41.207-17.417,64.236c0,35.216,12.517,65.329,37.544,90.362 s55.151,37.544,90.362,37.544c35.214,0,65.329-12.518,90.362-37.544s37.545-55.146,37.545-90.362 c0-23.029-5.808-44.447-17.419-64.236c43.585,22.265,79.846,55.865,108.776,100.783C449.767,294.84,418.031,325.913,379.867,349.04 z"/></symbol>
                                  </svg>
                                  <svg class="icon" viewBox="0 0 30 30"><use  href=" eye-open" x="28%" y="28%"></use></svg>
                                  <span class="lblcart">Quick View</span>
                                </a>
                              </div>                  
                              <div class="btn-wishlist">
                                <a href=" ">
                                  <svg xmlns="http://www.w3.org/2000/svg" style={{display:"none"}}>
                                    <symbol id="heart-shape-outline" viewBox="0 0 1400 1400"><title>heart-shape-outline</title><path d="M492.719,166.008c0-73.486-59.573-133.056-133.059-133.056c-47.985,0-89.891,25.484-113.302,63.569c-23.408-38.085-65.332-63.569-113.316-63.569C59.556,32.952,0,92.522,0,166.008c0,40.009,17.729,75.803,45.671,100.178l188.545,188.553c3.22,3.22,7.587,5.029,12.142,5.029c4.555,0,8.922-1.809,12.142-5.029l188.545-188.553C474.988,241.811,492.719,206.017,492.719,166.008z"/></symbol>
                                  </svg>
                                  <svg class="icon" viewBox="0 0 30 30"><use  href=" heart-shape-outline" x="32%" y="33%"></use></svg>
                                </a>
                              </div>
                            </div> 
                          </div> 
                        </div>
                      </div>
                      <div class="product-thumb">
                        <div class="item">
                          <div class="product-desc">
                            <div class="product-title"><a href=" ">Comfort Vibe</a></div>
                            <div class="product-comments">  
                              <div class="star_content">
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                                  <div class="star star_on"></div>
                              </div>
                            </div>
                          </div>
                          <div class="image">
                            <a href=" " class="thumbnail product-thumbnail">
                              <img src="assets/images/product/16.jpg" alt="product-img" />
                              <img class="product-img-extra change" alt="product-img" src="assets/images/product/17.jpg"/>
                            </a>
                            <div class="product-flags">
                              <div class="sale">Sale</div>
                            </div>
                          </div>
                          <div class="caption">   
                            <p class="description">
                            The 30-inch Apple Cinema HD Display delivers an amazing 2560 x 1600 pixel resolution. Designed sp..</p>
                            <p class="price">
                              <span class="regular price-old">$30.00</span> 
                              <span class="price-discount">16%</span> 
                              <span class="price-sale">$25.00 </span>
                            </p>
                            <div class="btn-cart">
                              <a data-button-action="add-to-cart" class="button">
                                <i class="fa fa-shopping-cart"></i> 
                                <span class="lblcart">Add to cart</span>
                              </a>
                            </div>                          
                            <div class="button-group">  
                              <div class="btn-quickview"> 
                                <a class="quickbox" href=" ">
                                  <svg xmlns="http://www.w3.org/2000/svg" style={{display:"none"}}>
                                    <symbol id="eye-open" viewBox="0 0 1190 1190"><title>eye-open</title><path d="M505.918,236.117c-26.651-43.587-62.485-78.609-107.497-105.065c-45.015-26.457-92.549-39.687-142.608-39.687 c-50.059,0-97.595,13.225-142.61,39.687C68.187,157.508,32.355,192.53,5.708,236.117C1.903,242.778,0,249.345,0,255.818 c0,6.473,1.903,13.04,5.708,19.699c26.647,43.589,62.479,78.614,107.495,105.064c45.015,26.46,92.551,39.68,142.61,39.68 c50.06,0,97.594-13.176,142.608-39.536c45.012-26.361,80.852-61.432,107.497-105.208c3.806-6.659,5.708-13.223,5.708-19.699 C511.626,249.345,509.724,242.778,505.918,236.117z M194.568,158.03c17.034-17.034,37.447-25.554,61.242-25.554 c3.805,0,7.043,1.336,9.709,3.999c2.662,2.664,4,5.901,4,9.707c0,3.809-1.338,7.044-3.994,9.704 c-2.662,2.667-5.902,3.999-9.708,3.999c-16.368,0-30.362,5.808-41.971,17.416c-11.613,11.615-17.416,25.603-17.416,41.971 c0,3.811-1.336,7.044-3.999,9.71c-2.667,2.668-5.901,3.999-9.707,3.999c-3.809,0-7.044-1.334-9.71-3.999 c-2.667-2.666-3.999-5.903-3.999-9.71C169.015,195.482,177.535,175.065,194.568,158.03z M379.867,349.04 c-38.164,23.12-79.514,34.687-124.054,34.687c-44.539,0-85.889-11.56-124.051-34.687s-69.901-54.2-95.215-93.222 c28.931-44.921,65.19-78.518,108.777-100.783c-11.61,19.792-17.417,41.207-17.417,64.236c0,35.216,12.517,65.329,37.544,90.362 s55.151,37.544,90.362,37.544c35.214,0,65.329-12.518,90.362-37.544s37.545-55.146,37.545-90.362 c0-23.029-5.808-44.447-17.419-64.236c43.585,22.265,79.846,55.865,108.776,100.783C449.767,294.84,418.031,325.913,379.867,349.04 z"/></symbol>
                                  </svg>
                                  <svg class="icon" viewBox="0 0 30 30"><use  href=" eye-open" x="28%" y="28%"></use></svg>
                                  <span class="lblcart">Quick View</span>
                                </a>
                              </div>                  
                              <div class="btn-wishlist">
                                <a href=" ">
                                  <svg xmlns="http://www.w3.org/2000/svg" style={{display:"none"}}>
                                    <symbol id="heart-shape-outline" viewBox="0 0 1400 1400"><title>heart-shape-outline</title><path d="M492.719,166.008c0-73.486-59.573-133.056-133.059-133.056c-47.985,0-89.891,25.484-113.302,63.569c-23.408-38.085-65.332-63.569-113.316-63.569C59.556,32.952,0,92.522,0,166.008c0,40.009,17.729,75.803,45.671,100.178l188.545,188.553c3.22,3.22,7.587,5.029,12.142,5.029c4.555,0,8.922-1.809,12.142-5.029l188.545-188.553C474.988,241.811,492.719,206.017,492.719,166.008z"/></symbol>
                                  </svg>
                                  <svg class="icon" viewBox="0 0 30 30"><use  href=" heart-shape-outline" x="32%" y="33%"></use></svg>
                                </a>
                              </div>
                            </div> 
                          </div> 
                        </div>
                      </div>
                    </div>
                  </div>
                </section> */}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <div class="container">
        <div id="_mobile_left_column" class="row"></div>
        <div id="_mobile_right_column" class="row"></div>
        <div class="clearfix"></div>
      </div>
    </div>
  );
};

export default Products;
