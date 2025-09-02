import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Products.css";
import api from "../utils/api";
import toast from "react-hot-toast";
import { FiChevronDown, FiChevronUp } from "react-icons/fi"
import LoginModal from "./LoginModal"; // adjust path accordingly
import payment from "../assets/payment.png"; // adjust path accordingly

import { Tabs, Tab, Box, Typography, Paper, Divider, Chip, Button, CircularProgress } from "@mui/material";
import { Star, Info, Description, Replay } from "@mui/icons-material";







const Products = () => {
  const { id } = useParams();
  const [showLoginModal, setShowLoginModal] = useState(false);



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
  const [wishlistId, setWishlistId] = useState(null); // Track wishlist entry ID


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
  const [expanded, setExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const collapsedHeight = 50; // Height when collapsed
      setNeedsCollapse(contentHeight > collapsedHeight);
    }
  }, [product?.details]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };




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


    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setShowLoginModal(true);
      return;
    }

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
    const variationsParsed = JSON.parse(product.variation || "[]");

    // Step 1: Parse color hex and names
    const selectedHexColor = (selectedChoices["Color"] || "").toLowerCase();
    const colorHexArray = JSON.parse(product.colors || "[]");
    const colorNamesArray = (product.colorNames || "").split(",").map(c => c.trim());

    const colorMap = {};
    colorHexArray.forEach((hex, idx) => {
      if (hex && colorNamesArray[idx]) {
        colorMap[hex.toLowerCase()] = colorNamesArray[idx];
      }
    });

    const selectedColorName = colorMap[selectedHexColor] || "";

    // Step 2: Build cleaned-up variant parts
    const selectedValues = choiceOptionsParsed
      .map(({ title }) => (selectedChoices[title] || "").replace(/\s+/g, "")) // remove internal spaces
      .filter(Boolean);

    const selectedVariantParts = selectedColorName
      ? [selectedColorName, ...selectedValues]
      : selectedValues;

    const selectedVariant = selectedVariantParts.join("-").toLowerCase();

    console.log("Selected Variant:", selectedVariant);
    console.log("Available Variations:", variationsParsed.map(v => v.type));

    // Step 3: Find exact matching variant from variation array
    const matchedVariation = variationsParsed.find(
      v => v.type.replace(/\s+/g, "").toLowerCase() === selectedVariant
    );

    if (!matchedVariation) {
      toast.error("Selected variant not available.");
      return;
    }

    fd.append("variant", matchedVariation.type); // ✅ Correct matched variant (like "WhiteSmoke-0-3months")

    // Step 4: Optionally include color field
    if (selectedColorName && selectedColorName.trim() !== "") {
      fd.append("color", selectedColorName);
    }

    // Step 5: Append variation[] and choice[] fields
    choiceOptionsParsed.forEach(({ title, name }) => {
      const selectedValue = selectedChoices[title];
      if (selectedValue) {
        fd.append("variation[]", `${title} | ${selectedValue}`);
        fd.append("choice[]", `${name} | ${selectedValue}`);
      }
    });

    // Debug log formData
    console.log("Submitting form data:");
    for (let pair of fd.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Step 6: Submit
    try {
      const response = await api.post("ecom/order", fd);
      console.log("add To cart", response);
      if (response.data.success) {
        toast.success(response.data.message);
        CartDetails();
        window.dispatchEvent(new Event("cart-updated"));
        return true;
      } else {
        const message =
          response.data.message ||
          (Array.isArray(response.data.messages) && response.data.messages.length > 0
            ? response.data.messages[0]
            : "Something went wrong");
        toast.error(message);
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

      console.log("Reviews", response)
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


        // ✅ find the wishlist item with matching product id
        const matchedItem = wishlist.find((item) => item.id == id || item.product_id == id);

        if (matchedItem) {
          setIsWishlisted(true);
          setWishlistId(matchedItem.wishlistId); // ✅ assign wishlistId
        } else {
          setIsWishlisted(false);
          setWishlistId(null);
        }
      }
    } catch (error) {
      console.error("Wishlist API Error:", error);
      toast.error("Something went wrong");
    }
  };

  const handleTabChange = (e, newValue) => {
    setActiveTab(newValue);
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
      else {
        toast.error(response.data.message)
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
      0: { items: 3 },
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
      1000: { items: 4 },
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
    const hexes = colorHexList;
    const names = colorNameList;

    if (hexes?.length !== names?.length) {
      console.warn("⚠️ Color hex and name count mismatch!", hexes, names);
    }

    hexes.forEach((hex, idx) => {
      const reversedIdx = hexes.length - 1 - idx;
      if (hex && names[reversedIdx]) {
        map[hex.toLowerCase()] = names[reversedIdx];
      }
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
    if (!product) return;

    try {
      const parsedChoices = JSON.parse(product.choice_options || "[]");
      const parsedColors = JSON.parse(product.colors || "[]");

      const initialChoices = {};

      // Default color
      if (parsedColors.length > 0) {
        const firstColor = parsedColors[0];
        initialChoices["Color"] = firstColor;
        setSelectedColor(firstColor);
      }

      // Sort & set other choice options
      const order = ["years", "size", "sm", "md", "lg"];
      const sortedChoices = [...parsedChoices].sort((a, b) => {
        const aIndex = order.findIndex((o) => a.title.toLowerCase().includes(o));
        const bIndex = order.findIndex((o) => b.title.toLowerCase().includes(o));
        return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
      });

      setChoiceOptions(sortedChoices);

      sortedChoices.forEach((choice) => {
        if (choice.options.length > 0) {
          initialChoices[choice.title] = choice.options[0];
        }
      });

      setSelectedChoices(initialChoices);
    } catch (e) {
      console.error("Failed to set default selections", e);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;

    try {
      const variations = JSON.parse(product.variation || "[]");

      const selectedHexColor = (selectedChoices["Color"] || "").toLowerCase();
      const selectedColorName = colorMap[selectedHexColor] || "";

      const selectedVariantValues = [];




      if (selectedColorName) selectedVariantValues.push(selectedColorName);

      choiceOptions.forEach(({ title }) => {
        if (title.toLowerCase() !== "color") {
          const val = selectedChoices[title];
          if (val) selectedVariantValues.push(val);
        }
      });

      const variantKey = selectedVariantValues.join("-").replace(/\s+/g, "").toLowerCase();


      console.log("Selected Hex:", selectedHexColor);
      console.log("Color Map:", colorMap);
      console.log("Resolved Color Name:", selectedColorName);
      console.log("Built Variant Key:", variantKey);
      console.log("All Variants:", variations.map(v => v.type));



      const foundVariant = variations.find(
        v => v.type.replace(/\s+/g, "").toLowerCase() === variantKey
      );





      if (foundVariant) {
        setVariantPrice(foundVariant.price); // ✅ already sets correct variation price
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
    if (isWishlisted && wishlistId) {
      await removeProduct(wishlistId); // ✅ use correct wishlistId from API
      setIsWishlisted(false);
      setWishlistId(null);
      toast.success("Removed from wishlist");
    } else {
      await addWishlist();
      getWishlistDetails(); // ✅ refresh to get latest wishlistId
    }
  };


  const calculateDiscountedPrice = (price, discount, type) => {
    if (!price || !discount) return price;
    const numericPrice = parseFloat(price);
    const numericDiscount = parseFloat(discount);

    if (type === "flat") {
      return Math.max(numericPrice - numericDiscount, 0).toFixed(2);
    } else if (type === "percent") {
      return (numericPrice - (numericPrice * numericDiscount) / 100).toFixed(2);
    }

    return numericPrice.toFixed(2);
  };



  const [imageSize, setImageSize] = useState(500);

  useEffect(() => {
    const handleResize = () => {
      setImageSize(window.innerWidth <= 768 ? 400 : 500); // 400px for mobile, 500px otherwise
    };

    handleResize(); // Set on mount
    window.addEventListener("resize", handleResize); // Update on resize

    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  const DetailItem = ({ label, value, highlight }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography component="span" fontSize={14} color="text.secondary">
        <strong>{label}:</strong>
      </Typography>
      <Typography
        component="span"
        fontSize={14}
        color={highlight ? '#16a34a' : 'text.primary'}
        fontWeight={highlight ? 600 : 'normal'}
      >
        {value || "—"}
      </Typography>
    </Box>
  );



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
                   "

                  >
                    <section class="page-content" id="content">
                      <ul class="product-flags">
                        {/* <li class="product-flag new">New</li> */}
                      </ul>
                      <div className="images-container">
                        <div className="product-cover">
                          <div
                            id="product-zoom"
                            style={{
                              width: `${imageSize}px`,
                              height: `${imageSize}px`,
                              backgroundColor: "#fff",
                              margin: "0 auto", // center on page
                            }}
                          >
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
                                  height: "100%",
                                  objectFit: "fill",
                                  backgroundColor: "#F6F7F9",
                                  borderRadius: "8px",
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
                        <div
                          className="product-header"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "10px",
                            borderBottom: " 1px solid #ccc"


                          }}
                        >
                          <h1
                            className="h1 "
                            style={{
                              flex: 1,
                              fontSize: "22px",
                              fontWeight: "600",
                              margin: 0,
                              wordBreak: "break-word",   // wraps long names
                              paddingBottom: "10px"
                            }}
                          >
                            {product?.name}
                          </h1>

                          <div
                            className="wishlist-icon"
                            style={{ cursor: "pointer", flexShrink: 0 }}
                            onClick={toggleWishlist}
                          >
                            <i
                              className="material-icons"
                              style={{ color: isWishlisted ? "red" : "#aaa", fontSize: "28px" }}
                            >
                              {isWishlisted ? "favorite" : "favorite_border"}
                            </i>
                          </div>
                        </div>


                        <div class="product-information mt-3">

                          <div class="product-comments display_comments">
                            <div class="star_content">
                              <div class="star star_on"></div>
                              <div class="star star_on"></div>
                              <div class="star star_on"></div>
                              <div class="star star_on"></div>
                              <div class="star star_on"></div>
                            </div>
                            <div class="comment_advice">

                              <a

                                className="write_comment scrollLink"
                              >
                                {reviews.length > 0 ? `${reviews.length} Reviews` : "No Reviews Yet"}
                              </a>


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
                                          key={i}
                                          className={`btn btn-outline-primary ${selectedChoices[choice.title] === opt ? "active" : ""}`}
                                          style={{
                                            marginRight: "7px",
                                            backgroundColor:
                                              selectedChoices[choice.title] === opt ? "#EB4D7F" : "",

                                            color: selectedChoices[choice.title] === opt ? "#fff" : "",
                                            borderColor: selectedChoices[choice.title] === opt ? "#EB4D7F" : "",
                                          }}

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
                                          key={index}
                                          className={`btn btn-outline-dark ${selectedChoices["Size"] === opt.value ? "active" : ""}`}
                                          style={{
                                            padding: "12px 20px", // Bigger padding for button size
                                            fontSize: "16px",     // Larger font
                                            marginRight: "7px",
                                            backgroundColor:
                                              selectedChoices["Size"] === opt.value ? "#EB4D7F" : "",
                                            color: selectedChoices["Size"] === opt.value ? "#fff" : "",
                                            borderColor: selectedChoices["Size"] === opt.value ? "#EB4D7F" : "",

                                          }}

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
                                {/* THEN ANY OTHER CHOICE FIELDS */}
                                {otherChoices.map((choice, index) => (
                                  <div
                                    key={`other-${index}`}
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
                                          key={i}
                                          className={`btn btn-outline-dark ${selectedChoices[choice.title] === opt ? "active" : ""}`}
                                          style={{
                                            padding: "12px 20px", // Bigger padding for button size
                                            fontSize: "16px",     // Larger font
                                            marginRight: "7px",
                                            backgroundColor:
                                              selectedChoices[choice.title] === opt ? "#EB4D7F" : "",
                                            color: selectedChoices[choice.title] === opt ? "#fff" : "",
                                            borderColor: selectedChoices[choice.title] === opt ? "#EB4D7F" : "",
                                          }}
                                          onClick={() =>
                                            handleChoiceChange(choice.title, opt)
                                          }
                                        >
                                          <input
                                            type="radio"
                                            name={`other-${index}`}
                                            value={opt}
                                            checked={selectedChoices[choice.title] === opt}
                                            readOnly
                                            className="d-none"
                                          />
                                          {opt}
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                ))}


                                {/* COLOR */}
                                {colorOptions.length > 0 && (
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
                                          <label >
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
                                                console.log(color)
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
                                )}
                              </div>
                              {/* <section class="product-discounts"></section> */}
                              <div className="product-prices">
                                <div className="product-price h5">
                                  <meta itemProp="priceCurrency" content="INR" />
                                  <div className="current-price">
                                    {product?.discount_type && product?.discount
                                      ? <>
                                        <span style={{ textDecoration: "line-through", color: "#999", marginRight: "8px" }}>
                                          ₹{variantPrice}
                                        </span>
                                        <span style={{ color: "#e53935", fontWeight: "bold" }}>
                                          ₹{calculateDiscountedPrice(variantPrice, product.discount, product.discount_type)}
                                        </span>

                                        {product.discount_type === "percent" && (
                                          <span style={{ marginLeft: "8px", color: "#388e3c", fontWeight: 500 }}>
                                            ({product.discount}% OFF)
                                          </span>
                                        )}
                                      </>
                                      : <span itemProp="price">₹{variantPrice}</span>
                                    }
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
                                      type="button" // ✅ prevent implicit submit
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
                                      type="button" // ✅ prevent form submit
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
                                        style={{
                                          padding: "12px 20px", // Bigger padding for button size
                                          fontSize: "16px",
                                        }}
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
                                        style={{
                                          padding: "12px 20px", // Bigger padding for button size
                                          fontSize: "16px",
                                        }}
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


                                        padding: "12px 20px", // Bigger padding for button size
                                        fontSize: "16px",

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

                            </form>
                          </div>

                          {/* desccccccc */}
                          <div className="product-description-card">


                            <div
                              ref={contentRef}
                              // onClick={toggleExpand}
                              className={`description-content ${expanded ? 'expanded' : 'collapsed'}`}
                              dangerouslySetInnerHTML={{ __html: product?.details }}
                            />

                            {needsCollapse && (
                              <div className="expand-controls">
                                <button
                                  className="expand-button"
                                  onClick={toggleExpand}
                                  aria-label={expanded ? "Show less description" : "Show more description"}
                                >
                                  {expanded ? (
                                    <>
                                      <span>Show Less</span>
                                      <FiChevronUp className="icon" />
                                    </>
                                  ) : (
                                    <>
                                      <span>Read Full Description</span>
                                      <FiChevronDown className="icon" />
                                    </>
                                  )}
                                </button>
                                {!expanded && <div className="fade-overlay"></div>}
                              </div>
                            )}
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                                  <li style={{ backgroundColor: "transparent" }}>
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
                                  {/* <li>
                                      <a
                                        href="https://www.instagram.com/thridle/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="View on Instagram"
                                        style={iconStyle("#E1306C")}
                                      >
                                        <i className="fab fa-instagram"></i>
                                      </a>
                                    </li> */}

                                  {/* WhatsApp */}
                                  <li style={{ backgroundColor: "transparent" }}>
                                    <a
                                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
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

                            <div>

                              <img src={payment} alt="ww" width="300px" />
                            </div>

                          </div>

                          {/* <div id="block-reassurance">
                                <ul>
                                  <li onClick={() => navigate("/page/privacy-policy")}>
                                    <div class="block-reassurance-item">
                                      <img
                                        src="../../assets/images/block-reassurance/1.png"
                                        alt="Security policy (edit with Customer reassurance module)"
                                      />
                                      &nbsp;
                                      <span class="h6">
                                        Security policy 
                                      </span>
                                    </div>
                                  </li>
                                  <li  onClick={() => navigate("/page/shipping-policy")}>
                                    <div class="block-reassurance-item">
                                      <img
                                        src="../../assets/images/block-reassurance/2.png"
                                        alt="Delivery policy (edit with Customer reassurance module)"
                                      />
                                      &nbsp;
                                      <span class="h6">
                                        Delivery policy 
                                      </span>
                                    </div>
                                  </li>
                                  <li onClick={() => navigate("/page/return-policy")}>
                                    <div class="block-reassurance-item">
                                      <img
                                        src="../../assets/images/block-reassurance/3.png"
                                        alt="Return policy (edit with Customer reassurance module)"
                                      />
                                      &nbsp;
                                      <span class="h6">
                                        Return policy 
                                      </span>
                                    </div>
                                  </li>
                                </ul>
                              </div> */}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div class="row product-block-information">
                  <Box className="col-12 product-details" sx={{ mt: { xs: 2, md: 3 } }}>
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: { xs: 2, md: 3 },
                        p: { xs: 1.5, md: 2 },
                        border: '1px solid',
                        borderColor: 'divider',
                        background: 'white',
                      }}
                    >
                      {/* --- Tabs --- */}
                      <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                          "& .MuiTab-root": {
                            fontWeight: 500,
                            textTransform: "none",
                            fontSize: { xs: 14, md: 15 },
                            minHeight: 48,
                            minWidth: 'auto',
                            px: { xs: 1.5, md: 2 },
                            color: 'text.secondary'
                          },
                          "& .Mui-selected": {
                            color: "#EB4D7F !important",
                          },
                          "& .MuiTabs-indicator": {
                            backgroundColor: "#EB4D7F",
                            height: 3,
                            borderRadius: 2
                          },
                        }}
                      >
                        <Tab
                          icon={<Description fontSize="small" />}
                          iconPosition="start"
                          label="Description"
                          value="description"
                          sx={{ mr: { xs: 1, md: 2 } }}
                        />
                        <Tab
                          icon={<Info fontSize="small" />}
                          iconPosition="start"
                          label="Details"
                          value="product-details"
                          sx={{ mr: { xs: 1, md: 2 } }}
                        />
                        <Tab
                          icon={<Star fontSize="small" />}
                          iconPosition="start"
                          label={
                            <Box display="flex" alignItems="center">
                              Reviews
                              {reviews.length > 0 && (
                                <Chip
                                  label={reviews.length}
                                  size="small"
                                  sx={{
                                    ml: 1,
                                    bgcolor: "#EB4D7F",
                                    color: "white",
                                    fontSize: '0.7rem',
                                    height: 20
                                  }}
                                />
                              )}
                            </Box>
                          }
                          value="tab-review"
                          sx={{ mr: { xs: 1, md: 2 } }}
                        />
                        <Tab
                          icon={<Replay fontSize="small" />}
                          iconPosition="start"
                          label="Returns"
                          value="return"
                        />
                      </Tabs>

                      <Divider sx={{ my: 2 }} />

                      {/* --- Tab Panels --- */}
                      {activeTab === "description" && (
                        <Box sx={{ pt: 1 }}>
                          {product?.video_url && product?.video_provider === "youtube" && (
                            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                              <Box
                                sx={{
                                  width: "100%",
                                  maxWidth: 720,
                                  aspectRatio: "16/9",
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  boxShadow: 2,
                                }}
                              >
                                <iframe
                                  src={product.video_url}
                                  title="Product Video"
                                  frameBorder="0"
                                  allowFullScreen
                                  loading="lazy"
                                  style={{ width: "100%", height: "100%" }}
                                ></iframe>
                              </Box>
                            </Box>
                          )}
                          <Typography
                            dangerouslySetInnerHTML={{ __html: product?.details }}
                            sx={{
                              color: "text.primary",
                              lineHeight: 1.7,
                              fontSize: { xs: '0.9rem', md: '1rem' }
                            }}
                          />
                        </Box>
                      )}

                      {activeTab === "product-details" && (
                        <Box sx={{
                          p: { xs: 2, md: 3 },
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          background: '#fafafa'
                        }}>
                          <Typography variant="h6" gutterBottom fontWeight={600}>
                            Product Information
                          </Typography>
                          <Divider sx={{ mb: 2 }} />

                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                              gap: { xs: 1.5, md: 2 },
                            }}
                          >
                            <DetailItem label="Brand" value={product?.brandName} />
                            <DetailItem label="Category" value={product?.categoryName} />
                            <DetailItem label="Subcategory" value={product?.subCategoryName} />
                            <DetailItem label="Product Code" value={product?.code} />
                           <DetailItem
  label="Unit Price"
  value={
    product?.discount_type && product?.discount ? (
      <span>
        <span style={{ textDecoration: "line-through", color: "#999", marginRight: "8px" }}>
          ₹{product.unit_price}
        </span>
        <span style={{ color: "#e53935", fontWeight: "bold" }}>
          ₹{calculateDiscountedPrice(product.unit_price, product.discount, product.discount_type)}
        </span>
        {product.discount_type === "percent" && (
          <span style={{ marginLeft: "8px", color: "#388e3c", fontWeight: 500 }}>
            ({product.discount}% OFF)
          </span>
        )}
      </span>
    ) : (
      product?.unit_price ? `₹${product.unit_price}` : null
    )
  }
  highlight
/>

                            <Box>
                              <strong>Stock:</strong>{" "}
                              <span style={{
                                color: product?.current_stock > 0 ? "#16a34a" : "#dc2626",
                                fontWeight: 500
                              }}>
                                {product?.current_stock > 0 ? `${product?.current_stock} in stock` : "Out of stock"}
                              </span>
                            </Box>
                            <DetailItem label="Unit" value={product?.unit} />
                            <DetailItem label="Colors" value={product?.colorNames} />
                          </Box>
                        </Box>
                      )}

                      {activeTab === "tab-review" && (
                        <Box>
                          <Box mb={2}>
                            <Button
                              variant="contained"
                              sx={{
                                borderRadius: "50px",
                                bgcolor: "#48B7FF",
                                textTransform: 'none',
                                fontSize: { xs: '0.875rem', md: '1rem' },
                                px: 3,
                                py: 1,
                                '&:hover': {
                                  bgcolor: '#1d4ed8'
                                }
                              }}
                              onClick={() => setShowReviewForm(!showReviewForm)}
                            >
                              {showReviewForm ? "Cancel" : "Add Review"}
                            </Button>
                          </Box>

                          {showReviewForm && (
                            <Paper
                              component="form"
                              onSubmit={addReview}
                              sx={{
                                p: { xs: 2, md: 3 },
                                mb: 3,
                                borderRadius: 2,
                                background: '#f8fafc'
                              }}
                            >
                              <Typography fontWeight={600} gutterBottom>
                                Your Rating:
                              </Typography>
                              <Box sx={{ display: "flex", gap: 0.5, mb: 2 }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    onClick={() => setNewReviewStars(star)}
                                    sx={{
                                      cursor: "pointer",
                                      color: star <= newReviewStars ? "#f5c518" : "#ddd",
                                      fontSize: { xs: '1.75rem', md: '2rem' },
                                      transition: 'color 0.2s'
                                    }}
                                  />
                                ))}
                              </Box>
                              <textarea
                                rows={4}
                                value={newReviewText}
                                onChange={(e) => setNewReviewText(e.target.value)}
                                placeholder="Write your honest feedback..."
                                style={{
                                  width: "100%",
                                  padding: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #ddd",
                                  fontFamily: 'inherit',
                                  fontSize: '0.9rem',
                                  resize: 'vertical',
                                  boxSizing: 'border-box'
                                }}
                                required
                              />
                              <Button
                                variant="contained"
                                sx={{
                                  mt: 2,
                                  borderRadius: "50px",
                                  textTransform: 'none',
                                  bgcolor: '#EB4D7F',
                                  fontSize: '0.9rem',
                                  px: 3,
                                  '&:hover': {
                                    bgcolor: '#15803d'
                                  }
                                }}
                                disabled={!newReviewStars || !newReviewText}
                                type="submit"
                              >
                                Submit Review
                              </Button>
                            </Paper>
                          )}

                          {loadingReviews ? (
                            <Box textAlign="center" py={4}>
                              <CircularProgress size={32} />
                              <Typography mt={2} color="text.secondary">Loading reviews...</Typography>
                            </Box>
                          ) : reviews.length > 0 ? (
                            reviews.map((rev, i) => (
                              <Paper
                                key={i}
                                sx={{
                                  p: { xs: 2, md: 2.5 },
                                  mb: 2,
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: 'divider'
                                }}
                              >
                                <Box display="flex" justifyContent="space-between" mb={1} flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
                                  <Typography fontWeight={600}>{rev.customerName}</Typography>
                                  <Box display="flex" alignItems="center">
                                    <Star sx={{ color: "#f5c518", fontSize: '1.2rem' }} />
                                    <Typography ml={0.5}>({rev.rating})</Typography>
                                  </Box>
                                </Box>
                                <Typography color="text.secondary" fontSize={14}>{rev.comment}</Typography>
                              </Paper>
                            ))
                          ) : (
                            <Typography textAlign="center" color="text.secondary" py={3}>
                              No reviews yet.
                            </Typography>
                          )}
                        </Box>
                      )}

                      {activeTab === "return" && (
                        <Box sx={{
                          p: { xs: 2, md: 3 },
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border: '1px solid',
                          borderColor: 'divider'
                        }}>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            Thridle Private Limited – Refund & Return Policy
                          </Typography>
                          <Typography color="text.secondary" mb={2} fontSize={14}>
                            At <strong>Thridle</strong>, we care about your satisfaction. If you're not completely happy with your purchase, we're here to help. Please read our refund policy carefully.
                          </Typography>
                          {/* ... keep your list points same but styled with <Typography> ... */}
                        </Box>
                      )}
                    </Paper>
                  </Box>
                  <section className="product-accessories-block clearfix" style={{ marginBottom: "0" }}>
                    <h3 className="home-title">

                      You might also like
                    </h3>
                    <div className="block_content">
                      <OwlCarousel className="owl-theme" {...options} id="ishi-product-accessories">
                        {loading
                          ? [...Array(4)].map((_, idx) => (
                            <div key={idx} className="product-thumb" style={{ padding: "10px" }}>
                              <div className="product-thumb-skeleton">
                                <div className="skeleton-image"></div>
                                <div className="skeleton-title"></div>
                                <div className="skeleton-rating"></div>
                                <div className="skeleton-price"></div>
                              </div>
                            </div>
                          ))
                          : products.map((product, idx) => {
                            const imageArray = JSON.parse(product.images || "[]");
                            const mainImg = product.thumbnail || "";
                            const hoverImg = imageArray[1]?.image_name;

                            const price = Number(product.unit_price) || 0;
                            const discountValue = Number(product.discount) || 0;
                            const discountType = product.discount_type;

                            let finalPrice = price;
                            let originalPrice = null;

                            if (discountValue > 0) {
                              if (discountType === "percent") {
                                finalPrice = price - (price * discountValue) / 100;
                              } else if (discountType === "flat") {
                                finalPrice = price - discountValue;
                              }
                              originalPrice = price;
                            }

                            return (
                              <div
                                key={idx}
                                className="product-thumb"
                                style={{ padding: "0px", cursor: "pointer", marginBottom: "10px" }}
                                onClick={() => navigate(`/product/${product.id}`)}
                              >
                                <div className="product-card">
                                  {/* Product Image */}
                                  <div className="product-image-container">
                                    <img
                                      className="product-image primary"
                                      src={`https://thridle.com/ecom/storage/app/public/product/thumbnail/${mainImg}`}
                                      alt={product.name}
                                    />
                                    <img
                                      className="product-image secondary"
                                      src={
                                        hoverImg
                                          ? `https://thridle.com/ecom/storage/app/public/product/${hoverImg}`
                                          : `https://thridle.com/ecom/storage/app/public/product/thumbnail/${mainImg}`
                                      }
                                      alt={product.name}
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

                                  {/* Product Info */}
                                  <div className="product-info">
                                    <h4 className="product-title">{product.name}</h4>
                                    {/* <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <i className="fas fa-star" key={i}></i>
                      ))}
                      <span className="rating-count">(24)</span>
                    </div> */}

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
                    </div>

                    {/* Styles */}
                    <style jsx>{`
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
      height: 250px;
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
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .quick-view-btn {
      position: absolute;
      bottom: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.95);
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      color: #2d3748;
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
      background: #48b7ff;
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
      font-size: 14px;
      color: #2d3748;
      margin-bottom: 6px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 40px;
    }
    .rating {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    .rating i {
      color: #ffc107;
      font-size: 11px;
      margin-right: 2px;
    }
    .rating-count {
      font-size: 11px;
      color: #718096;
      margin-left: 5px;
    }
    .price-container {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .original-price {
      text-decoration: line-through;
      color: #a0aec0;
      font-size: 15px;
    }
    .current-price {
      color: #EB4D7F;
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
      background: #48b7ff;
      color: white;
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    .add-to-cart-btn:hover {
      background: #0074e4;
    }
    .wishlist-btn {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      width: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }
    .wishlist-btn:hover {
      background: #fed7d7;
      border-color: #feb2b2;
      color: #e53e3e;
    }
    /* Skeleton Loader */
    .product-thumb-skeleton {
      padding: 10px;
    }
    .skeleton-image,
    .skeleton-title,
    .skeleton-rating,
    .skeleton-price {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
    }
    .skeleton-image {
      height: 220px;
      border-radius: 8px;
      margin-bottom: 12px;
    }
    .skeleton-title {
      height: 18px;
      width: 80%;
      margin-bottom: 8px;
    }
    .skeleton-rating {
      height: 14px;
      width: 60%;
      margin-bottom: 8px;
    }
    .skeleton-price {
      height: 18px;
      width: 40%;
    }
    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `}</style>
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
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false);
            AddToCart(); // Retry add to cart after successful login
          }}
        />
      )}


      <div class="container">
        <div id="_mobile_left_column" class="row"></div>
        <div id="_mobile_right_column" class="row"></div>
        <div class="clearfix"></div>
      </div>
    </div>
  );
};

export default Products;
