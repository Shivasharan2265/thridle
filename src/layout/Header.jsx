import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import thridle from "../../public/assets/THRIDLE.png";
import "./Header.css";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import profile from "../assets/user.png"
import clock from "../assets/clock.png"
import logout from "../assets/logout.png"
import login from "../assets/enter.png"
import bag from "../assets/shopping-bag.png"
import wishlist from "../assets/wishlist.png"
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';



const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const authToken = localStorage.getItem("authToken");
  const isLoggedIn = !!authToken && authToken !== "Guest";

  const [isMobile, setIsMobile] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryMap, setSubCategoryMap] = useState({});
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cartIdToDelete, setCartIdToDelete] = useState(null);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Normalize tax model (assume first item sets model for now)
  // Totals
  let subtotal = 0;
  let taxTotal = 0;
  let total = 0;

  // Shipping total
  let shippingTotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.shipping_cost || 0),
    0
  );

  cartItems.forEach((item) => {
    const price = parseFloat(item.price || 0) * parseInt(item.quantity || 1);
    const taxPercent = parseFloat(item.tax || 0);
    const model = (item.tax_model || "").toLowerCase();

    if (model === "include") {
      // Remove embedded tax from subtotal
      const taxPortion = (price * taxPercent) / (100 + taxPercent);
      subtotal += price - taxPortion;
      taxTotal += taxPortion;
      total += price; // already contains tax
    } else {
      // Tax is excluded, so add it
      const taxAmount = (taxPercent / 100) * price;
      subtotal += price;
      taxTotal += taxAmount;
      total += price + taxAmount;
    }
  });

  // Add shipping at the end
  total += shippingTotal;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };
  const options = {
    items: 4,
    loop: true,
    autoplay: true,
    margin: 10,
    nav: false,
    dots: false,
    responsive: {
      0: { items: 2 },
      600: { items: 2 },
      992: { items: 2 },
      1200: { items: 2 },
    },
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 968); // You can adjust the breakpoint
    };

    handleResize(); // Set initially
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const desiredOrder = ['Baby', 'Boy', 'Girl'];

  const fetchCategories = async () => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "getCategoryDetails");

    try {
      const response = await api.post("/ecom/category", fd);
      console.log("Category Response:", response);

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

      if (response.data?.success) {
        const fetchedCategories = response.data.data;

        // Sort categories based on the desiredOrder
        const sortedCategories = [...fetchedCategories].sort((a, b) => {
          return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
        });

        setCategories(sortedCategories);
      }
    } catch (error) {
      console.error("Category Error:", error);
    }
  };

  const fetchSubCategories = async (id) => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "getSubAndSubSubCategory");
    fd.append("id", id);

    try {
      const response = await api.post("/ecom/category", fd);
      // console.log("SubCategory", response);
      if (response?.data?.success) {
        const category = response.data.data.category;
        const subCats = category?.subCategories || [];

        setSubCategoryMap((prev) => ({
          ...prev,
          [id]: subCats,
        }));
      }
    } catch (error) {
      console.error("Subcategory Fetch Error:", error);
    }
  };
  const CartDetails = async () => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "getCartDetails");

    try {
      const response = await api.post("/ecom/order", fd);
      console.log("CART", response)
      const cartData = response?.data?.data || [];

      console.log("Cart Response:", response);

      setCartItems(cartData);
      setCartCount(cartData.length); // Or sum quantities
    } catch (error) {
      console.error("Cart Error:", error);
    }
  };
  const removeProduct = async (cartId) => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "removeProductFromCart");
    fd.append("cartId", cartId);

    try {
      const response = await api.post("/ecom/order", fd);
      // console.log("Removed item response:", response?.data);

      // Optimistically remove from state
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== cartId)
      );
      setCartCount((prevCount) => prevCount - 1);
      navigate(0)
    } catch (error) {
      console.error("Remove Error:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
    CartDetails();

    const handleCartUpdate = () => {
      CartDetails(); // 🔁 refresh cart
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);




  return (
    <div>
      <header id="header" className="home">
        <div className="header-nav" style={{ backgroundColor: "#fff", border: "none" }}>
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 left-nav">
                {/* <!-- Block search  --> */}

                {isMobile && (
                  <>
                    <style>
                      {`
        #_desktop_seach_widget input::placeholder {
          color: gray;
          opacity: 1;
        }

        #_desktop_seach_widget input {
          color: black;
        }

        #_desktop_seach_widget button i.material-icons.search {
          color: black;
        }

        #_desktop_seach_widget .search-logo .icon {
          fill: black;
        }
      `}
                    </style>

                    <div id="_desktop_seach_widget">
                      <div id="search_widget" className="search-widget">
                        <span className="search-logo hidden-lg-up">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ display: "none" }}
                          >
                            <symbol id="magnifying-glass" viewBox="0 0 910 910">
                              <title>magnifying-glass</title>
                              <path d="M495,466.2L377.2,348.4c29.2-35.6,46.8-81.2,46.8-130.9C424,103.5,331.5,11,217.5,11C103.4,11,11,103.5,11,217.5 S103.4,424,217.5,424c49.7,0,95.2-17.5,130.8-46.7L466.1,495c8,8,20.9,8,28.9,0C503,487.1,503,474.1,495,466.2z M217.5,382.9 C126.2,382.9,52,308.7,52,217.5S126.2,52,217.5,52C308.7,52,383,126.3,383,217.5S308.7,382.9,217.5,382.9z" />
                            </symbol>
                          </svg>
                          <svg className="icon" viewBox="0 0 30 30">
                            <use href="#magnifying-glass" x="22%" y="20%"></use>
                          </svg>
                        </span>
                        <form method="get" action="#">
                          <input
                            name="controller"
                            value="search"
                            type="hidden"
                          />
                          <span
                            role="status"
                            aria-live="polite"
                            className="ui-helper-hidden-accessible"
                          ></span>
                          <input
                            name="s"
                            value=""
                            placeholder="Search our catalog"
                            style={{ color: "black" }}
                            className="ui-autocomplete-input 11"
                            autoComplete="off"
                            type="text"
                          />
                          <button type="submit">
                            <i className="material-icons search"></i>
                          </button>
                        </form>
                      </div>
                    </div>
                  </>
                )}
                {isMobile && (
                  <div id="_desktop_seach_widget">
                    <div id="search_widget" className="search-widget">
                      <span className="search-logo hidden-lg-up">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ display: "none" }}
                        >
                          <symbol id="magnifying-glass" viewBox="0 0 910 910">
                            <title>magnifying-glass</title>
                            <path d="M495,466.2L377.2,348.4c29.2-35.6,46.8-81.2,46.8-130.9C424,103.5,331.5,11,217.5,11C103.4,11,11,103.5,11,217.5 S103.4,424,217.5,424c49.7,0,95.2-17.5,130.8-46.7L466.1,495c8,8,20.9,8,28.9,0C503,487.1,503,474.1,495,466.2z M217.5,382.9 C126.2,382.9,52,308.7,52,217.5S126.2,52,217.5,52C308.7,52,383,126.3,383,217.5S308.7,382.9,217.5,382.9z" />
                          </symbol>
                        </svg>
                        <svg className="icon" viewBox="0 0 30 30">
                          <use href="#magnifying-glass" x="22%" y="20%"></use>
                        </svg>
                      </span>
                      <form method="get" action="#">
                        <input name="controller" value="search" type="hidden" />
                        <span
                          role="status"
                          aria-live="polite"
                          className="ui-helper-hidden-accessible"
                        ></span>
                        <input
                          name="s"
                          value=""
                          placeholder="Search our catalog"
                          className="ui-autocomplete-input 22"
                          autoComplete="off"
                          type="text"
                          style={{
                            color: "black", // input text color
                            "::placeholder": {
                              color: "gray", // <-- this won't work inline
                            },
                          }}
                        />

                        <button type="submit" style={{ color: "black" }}>
                          <i className="material-icons search"></i>
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
              {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 right-nav">
                <div className="userinfo-inner">
                  <ul className="userinfo">
                    {isLoggedIn ? (
                      <>
                        <li className="profile">
                          <Link to="/profile" style={{ color: "white" }}>
                            Profile
                          </Link>
                        </li>

                        {isLoggedIn && location.pathname !== "/login" && (
                          <li className="profile" >
                            <a
                              onClick={handleLogout}
                              className="logout-link"
                              style={{ color: "white", position: "relative", display: "block" }}
                            >
                              Logout
                            </a>

                          </li>
                        )}

                      </>
                    ) : (
                      <>
                        <li className="log-in">
                          <Link to="/login" style={{ color: "white" }}>
                            Log in
                          </Link>
                        </li>
                        <li className="create_account">
                          <Link to="/register" style={{ color: "white" }}>
                            Create Account
                          </Link>
                        </li>
                      </>
                    )}

                  
                    {isLoggedIn && cartItems.length > 0 && location.pathname !== "/login" && (
                      <li className="checkout">
                        <Link
                          to="/check-out"
                          style={{ color: "white" }}
                        >
                          Checkout
                        </Link>
                      </li>
                    )}

                    {isLoggedIn && location.pathname !== "/login" && (
                      <li className="checkout">
                        <Link
                          to="/history"
                          style={{ color: "white" }}
                        >
                          My Orders
                        </Link>
                      </li>
                    )}



                  </ul>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <div className="nav-full-width" style={{ backgroundColor: "white", boxShadow: "0 4px 6px -2px rgba(0, 0, 0, 0.1)" }}>
          <div
            style={{
              margin: "0",
              padding: window.innerWidth >= 968 ? "0 25px" : "0",
            }}
          >
            <div className="w-100" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {/* Left: Logo */}
              {/* <!-- ------------------mega menu----------- --> */}
              {!isMobile && (
                <div
                  id="desktop_logo m-0 p-1"

                >
                  <Link to="/">
                    <img
                      className="logo img-responsive"
                      src={thridle}
                      alt="Demo Shop"
                      style={{ height: "60px" }}
                    />
                  </Link>
                </div>)}


                {!isMobile && (

              <div id="_desktop_top_menu" className="menu js-top-menu hidden-sm-down" style={{ flex: 1, display: "flex", justifyContent: "center" }}>

                <ul className="top-menu" id="top-menu" data-depth="0">
                  <li className="cms-page" id="category-12" style={{ color: "black" }}>
                    <Link className="dropdown-item" to="/">
                      Home
                    </Link>
                  </li>

                  <li className="cms-page" id="cms-page-4">
                    <Link
                      to="/about-us"
                      className="dropdown-item"
                      data-depth="0"
                    >
                      About us
                    </Link>
                  </li>
                  <li className="cms-page" id="cms-page-4">
                    <Link
                      to="/blog"
                      className="dropdown-item"
                      data-depth="0"
                    >
                      Blog
                    </Link>
                  </li>

                  <li className="cms-page" id="cms-page-1">
                    <Link to="/contact">Contact us</Link>
                  </li>

                  {categories.map((cat) => (
                    <li
                      className="cms-page"
                      id={`cms-page-${cat.id}`}
                      key={cat.id}
                      onMouseEnter={() => {
                        setHoveredCategoryId(cat.id);
                        if (!subCategoryMap[cat.id]) {
                          fetchSubCategories(cat.id);
                        }
                      }}
                      onMouseLeave={() => setHoveredCategoryId(null)}
                    >
                      <Link
                        to={`/category/${cat.id}`}
                        className="dropdown-item dropdown-submenu"
                        data-depth="1"
                      >
                        {cat.name}
                      </Link>

                      {hoveredCategoryId === cat.id &&
                        subCategoryMap[cat.id]?.length > 0 && (
                          <div
                            className="dropdown-menu show mega-menu p-2"
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              minWidth: '200px',
                              backgroundColor: '#fff',
                              borderRadius: '4px',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                          >
                            {subCategoryMap[cat.id].map((sub) => (
                              <div
                                key={sub.id}
                                className="dropdown-item"
                                style={{
                                  padding: '8px 12px',
                                  borderBottom: '1px solid #eee',
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  navigate(`/category/${cat.id}`, {
                                    state: { selectedSubCategories: [sub.id] },
                                    replace: false,
                                  });
                                  window.location.reload(); // Optional: Force refresh
                                }}
                              >
                                {sub.name}
                              </div>
                            ))}


                          </div>
                        )}
                    </li>
                  ))}


                  <li className="cms-page" id="category-12" style={{ color: "black" }}>

                   
                    <Link className="dropdown-item" to="/new">
                     
                      New Arrivals

                       <img 
      src="/new.gif" 
      alt="New Arrivals" 
      className="menu-gif-icon"
      style={{ width: '34px', height: '34px'}} 
    />
                    </Link>
                  </li>
                </ul>
              </div>

                )}

              <div className="clearfix"></div>


              {/* <!-- ------------------Search----------- --> */}

              {/* <!-- -------------------shopping cart----------- --> */}

              <div id="_desktop_cart" style={{ display: "flex", justifyContent: "flex-end" }}>
                <style>
                  {`
    #search_widget input::placeholder {
      color: #fff;
      opacity: 1;
    }

   
    .search-toggle-button {
      background: none;
      coloe: #fff;
      border: none;
      cursor: pointer;
    }
  `}
                </style>


                {!isMobile && (
                  <div id="_desktop_seach_widget" style={{ display: "flex", alignItems: "center", marginRight: "5px" }}>
                    <div id="search_widget" className="search-widget">
                      {!showSearch && (
                        <button
                          className="search-toggle-button"
                          onClick={() => setShowSearch(true)}
                          style={{ marginTop: "8px" }}
                        >
                          <i
                            className="material-icons search"
                            style={{ color: "black" }}
                          >
                            search
                          </i>
                        </button>
                      )}


                      {/* Full search shown only when toggled */}
                      {showSearch && (
                        <form
                          method="get"
                          action="#"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            maxWidth: "400px",
                            width: "100%",
                            margin: "0 auto",
                            background: "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "25px",
                            padding: "5px 10px",

                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          }}
                        >
                          <input
                            name="s"
                            placeholder="Search our catalog"
                            className="ui-autocomplete-input"
                            style={{
                              flex: 1,
                              border: "none",
                              outline: "none",
                              fontSize: "14px",
                              color: "#333",
                              background: "transparent",
                            }}
                            autoComplete="off"
                            type="text"
                          />

                          {/* Search button */}
                          {/* <button
      type="submit"
      style={{
        background: "transparent",
        border: "none",
        color: "#333",
        cursor: "pointer",
        padding: "5px",
        display: "flex",
        alignItems: "center",
      }}
      onClick={() => setShowSearch(false)}
    >
      <i className="material-icons search">search</i>
    </button> */}

                          {/* Close button */}
                          <button
                            type="button"
                            onClick={() => setShowSearch(false)}
                            style={{
                              marginTop: "5px",
                              background: "transparent",
                              border: "none",
                              color: "black",
                              fontSize: "16px",
                              fontWeight: "900",
                              cursor: "pointer",
                              marginLeft: "5px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            ✕
                          </button>
                        </form>
                      )}

                    </div>
                  </div>
                )}

                {!isMobile && (
                  <button
                          className="search-toggle-button"
                       onClick={() => navigate("/wishlist")}
                          style={{ marginTop: "8px" }}
                        >
                           <i className="material-icons">favorite_border</i>
                        </button>
                )}
                
                {!isMobile && (
                  <div style={{ display: "flex", alignItems: "center" }}>



                    <div className="blockcart cart-preview inactive" >
                      <div className="header">
                        <span >

                          <ShoppingBagIcon size={24} />
                          {cartCount > 0 && isLoggedIn && (
                            <span
                              style={{
                                position: "absolute",

                                top: "6px",
                                right: "75px",
                                background: "#EB4D7F",
                                color: "#fff",
                                zIndex: "9999",
                                borderRadius: "50%",
                                fontSize: "11px",
                                minWidth: "18px",
                                height: "18px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 600,
                                boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                              }}
                            >
                              {cartCount}
                            </span>

                          )}

                        </span>
                        <div className="cart-dropdown p-2">
                          {cartItems.length === 0 ? (
                            <div
                              style={{
                                zIndex: 999,
                                textAlign: "center",
                                padding: "40px 20px",
                                color: "#555",
                                fontSize: "18px",
                                background: "#f9fafb",
                                borderRadius: "12px",
                              }}
                            >
                              <div style={{ fontSize: "40px", marginBottom: "10px" }}>🛒</div>
                              <p className="mt-3">Your cart is empty</p>
                            </div>
                          ) : (
                            <>
                              <div className="product-container" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                {cartItems.map((item, index) => {
                                  const price = parseFloat(item.price || 0);
                                  const discount = parseFloat(item.discount || 0);
                                  const discountType = item.discount_type;
                                  let finalPrice = price;

                                  if (discount && discountType === "flat") {
                                    finalPrice = price - discount;
                                  } else if (discount && discountType === "percent") {
                                    finalPrice = price - (price * discount) / 100;
                                  }

                                  return (
                                    <div className="cart-card" key={index}>
                                      {/* Image */}
                                      <div
                                        className="cart-card__image"
                                        onClick={() => navigate(`/product/${item.product_id}`)}
                                      >
                                        <img
                                          src={`https://thridle.com/ecom/storage/app/public/product/thumbnail/${item.thumbnail}`}
                                          alt={item.name}
                                        />

                                      </div>

                                      {/* Details */}
                                      <div className="cart-card__details">
                                        {/* Header */}
                                        <div className="cart-card__header">
                                          <h4
                                            className="cart-card__title"
                                            onClick={() => navigate(`/product/${item.product_id}`)}
                                          >
                                            {item.name}
                                          </h4>
                                          <button
                                            className="cart-card__remove"
                                            onClick={() => {
                                              setCartIdToDelete(item.id);
                                              setShowDeleteModal(true);
                                            }}
                                            aria-label="Remove item"
                                          >
                                            <i className="fas fa-trash-alt"></i>
                                          </button>
                                        </div>

                                        {/* Price + Qty */}
                                        <div className="cart-card__pricing">
                                          <span className="cart-card__qty">Qty: {item.quantity}</span>
                                          <div className="cart-card__price-box m-2">

                                            <span className="cart-card__price--final">
                                              ₹{finalPrice.toFixed(2)}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Total for multiple qty */}
                                        {item.quantity > 1 && (
                                          <div className="cart-card__total">
                                            Total: ₹{(finalPrice * item.quantity).toFixed(2)}
                                          </div>
                                        )}

                                        {/* Attributes */}
                                        {(item.color || item.size) && (
                                          <div className="cart-card__attributes">
                                            {item.color && (
                                              <div className="cart-card__attr">
                                                <span className="cart-card__label">Color:</span>
                                                <span className="cart-card__value">
                                                  <span
                                                    className="cart-card__swatch"
                                                    style={{ backgroundColor: item.color.toLowerCase() }}
                                                    title={item.color}
                                                  ></span>
                                                  {item.color}
                                                </span>
                                              </div>
                                            )}
                                            {item.size && (
                                              <div className="cart-card__attr">
                                                <span className="cart-card__label">Size:</span>
                                                <span className="cart-card__value">{item.size}</span>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>

                                      {/* Styles */}
                                      <style jsx>{`
        .cart-card {
          display: flex;
          align-items: flex-start;
          background: #fff;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
          margin-bottom: 14px;
          border: 1px solid #eee;
          transition: all 0.3s ease;
        }
        .cart-card:hover {
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        /* Image */
        .cart-card__image {
          position: relative;
          flex-shrink: 0;
          margin-right: 16px;
          cursor: pointer;
          border-radius: 10px;
          overflow: hidden;
        }
        .cart-card__image img {
          height: 95px;
          width: 95px;
          object-fit: cover;
          border-radius: 10px;
          transition: transform 0.3s ease;
        }
        .cart-card__image:hover img {
          transform: scale(1.06);
        }
        .cart-card__badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #ff4757;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 7px;
          border-radius: 6px;
        }

        /* Details */
        .cart-card__details {
          flex: 1;
          min-width: 0;
        }
        .cart-card__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }
        .cart-card__title {
          font-size: 15px;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
          cursor: pointer;
          transition: color 0.2s;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
          margin-right: 10px;
        }
        .cart-card__title:hover {
          color: #48b7ff;
        }
        .cart-card__remove {
          background: none;
          border: none;
          color: #a0aec0;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          font-size: 16px;
          transition: all 0.2s;
        }
        .cart-card__remove:hover {
          color: #ff4757;
          background: rgba(255, 71, 87, 0.12);
        }

        /* Pricing */
        .cart-card__pricing {
        
          margin: 8px 0;
        }
        .cart-card__qty {
          font-size: 13px;
          color: #718096;
          background: #f7fafc;
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 500;
        }
        .cart-card__price-box {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cart-card__price--old {
          font-size: 13px;
          color: #a0aec0;
          text-decoration: line-through;
        }
        .cart-card__price--final {
          font-size: 16px;
          font-weight: 700;
          color: #48b7ff;
        }
        .cart-card__total {
          font-size: 14px;
          font-weight: 600;
          color: #2d3748;
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px dashed #e2e8f0;
        }

        /* Attributes */
        .cart-card__attributes {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 8px;
        }
        .cart-card__attr {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
        }
        .cart-card__label {
          color: #718096;
          font-weight: 500;
        }
        .cart-card__value {
          color: #4a5568;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .cart-card__swatch {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
        }

        /* Mobile */
        @media (max-width: 480px) {
          .cart-card {
            padding: 12px;
          }
          .cart-card__image img {
            height: 80px;
            width: 80px;
          }
          .cart-card__title {
            font-size: 14px;
          }
          .cart-card__pricing {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
        }
      `}</style>
                                    </div>
                                  );
                                })}

                              </div>

                              <div
                                className="billing-info"
                                style={{
                                  marginTop: "20px",
                                  background: "#fff",
                                  borderRadius: "12px",
                                  padding: "16px",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                }}
                              >
                                {[
                                  { label: "Subtotal", value: subtotal },
                                  { label: "Shipping", value: shippingTotal },
                                  { label: "Taxes", value: taxTotal },
                                  { label: "Total", value: total },
                                ].map((row, i) => (
                                  <div
                                    key={i}
                                    className="billing-row"
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      padding: "6px 0",
                                      fontWeight: row.label === "Total" ? 700 : 500,
                                      fontSize: row.label === "Total" ? "16px" : "14px",
                                      borderTop: i === 3 ? "1px solid #eee" : "none",
                                    }}
                                  >
                                    <span>{row.label}</span>
                                    <span>₹{row.value.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="cart-btn col-xs-12" style={{ marginTop: "20px" }}>
                                <Link
                                  to="/check-out"
                                  className="btn checkout"
                                  style={{
                                    display: "block",
                                    width: "100%",
                                    backgroundColor: "#48B7FF",
                                    color: "#fff",
                                    border: "none",
                                    padding: "12px",
                                    borderRadius: "10px",
                                    fontWeight: 600,
                                    textAlign: "center",
                                    transition: "0.3s",
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3399e6")}
                                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#48B7FF")}
                                >
                                  Proceed to Checkout
                                </Link>
                              </div>
                            </>
                          )}

                        </div>


                      </div>

                    </div>

                    <div ref={dropdownRef} style={{ position: "relative", marginLeft: "15px" }}>
                      {/* Profile Button with Floating Animation */}
                      <button
                        aria-label="User menu"
                        aria-expanded={open}
                        onClick={() => setOpen(!open)}
                        style={{
                          cursor: "pointer",
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                       background: "#fff",
                          boxShadow:"none",
                          border: "none",
                          outline: "none",
                          position: "relative",
                          // marginLeft: "-15px"
                         
                        }}
                       
                      >
                       <img src="/circle-user.png" alt="user" width="28px" />
                      </button>

                      {/* Premium Dropdown Menu */}
                      {open && (
                        <div
                          style={{
                            position: "absolute",
                            right: 0,
                            top: "56px",
                            minWidth: "220px",
                            background: "#fff",
                            borderRadius: "14px",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                            padding: "8px 0",
                            zIndex: 9999,
                            animation: "slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            backdropFilter: "blur(10px)",
                            background: "rgba(255, 255, 255, 0.95)",
                            overflow: "hidden",
                          }}
                        >

                          {isLoggedIn ? (
                            <>


                              {isLoggedIn && location.pathname !== "/login" && (
                                <Link
                                  to="/wishlist"
                                  onClick={() => setOpen(false)}   // 👈 this closes the dropdown
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "12px 16px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#4a5568",
                                    textDecoration: "none",
                                    transition: "all 0.2s ease",
                                  }}
                                  onMouseOver={(e) => (e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)")}
                                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                  <div style={{
                                    width: "24px",
                                    height: "24px",
                                    background: "rgba(102, 126, 234, 0.1)",
                                    borderRadius: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#667eea",
                                  }}><img src={wishlist} alt="ss" width="25px" /></div>
                                  Wishlist
                                </Link>
                              )}
                              {/* Checkout */}

                              {isLoggedIn && cartItems.length > 0 && location.pathname !== "/login" && (
                                <Link
                                  to="/check-out"
                                  onClick={() => setOpen(false)}   // 👈 this closes the dropdown
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "12px 16px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#4a5568",
                                    textDecoration: "none",
                                    transition: "all 0.2s ease",
                                  }}
                                  onMouseOver={(e) => (e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)")}
                                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                  <div style={{
                                    width: "24px",
                                    height: "24px",
                                    background: "rgba(102, 126, 234, 0.1)",
                                    borderRadius: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#667eea",
                                  }}><img src={bag} alt="ss" width="25px" /></div>
                                  Checkout
                                </Link>
                              )}
                              {/* History */}
                              {isLoggedIn && location.pathname !== "/login" && (
                                <Link
                                  onClick={() => setOpen(false)}   // 👈 this closes the dropdown
                                  to="/history"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "12px 16px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#4a5568",
                                    textDecoration: "none",
                                    transition: "all 0.2s ease",
                                  }}
                                  onMouseOver={(e) => (e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)")}
                                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                  <div style={{
                                    width: "24px",
                                    height: "24px",
                                    background: "rgba(102, 126, 234, 0.1)",
                                    borderRadius: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#667eea",
                                  }}><img src={clock} alt="ss" width="25px" /></div>
                                  Order History
                                </Link>
                              )}

                              {/* Profile */}

                              <Link
                                to="/profile"
                                onClick={() => setOpen(false)}   // 👈 this closes the dropdown
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                  padding: "12px 16px",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  color: "#4a5568",
                                  textDecoration: "none",
                                  transition: "all 0.2s ease",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)")}
                                onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                              >
                                <div style={{
                                  width: "24px",
                                  height: "24px",

                                  borderRadius: "6px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#667eea",
                                }}><img src={profile} alt="ss" width="25px" /></div>
                                Profile
                              </Link>

                              {/* Logout Button */}
                              <div style={{ height: "1px", background: "rgba(0,0,0,0.05)", margin: "4px 16px" }} />
                              {isLoggedIn && location.pathname !== "/login" && (
                                <button
                                  onClick={handleLogout}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    width: "100%",
                                    padding: "12px 16px",
                                    background: "transparent",
                                    border: "none",
                                    textAlign: "left",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#e53e3e",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                  }}
                                  onMouseOver={(e) => (e.currentTarget.style.background = "rgba(229, 62, 62, 0.1)")}
                                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                  <div style={{
                                    width: "24px",
                                    height: "24px",

                                    borderRadius: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#e53e3e",
                                  }}><img src={logout} alt="ss" width="25px" /></div>
                                  Logout
                                </button>
                              )}

                            </>
                          ) : (
                            <>

                              <Link
                                to="/login"
                                onClick={() => setOpen(false)}   // 👈 this closes the dropdown
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                  padding: "12px 16px",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  color: "#4a5568",
                                  textDecoration: "none",
                                  transition: "all 0.2s ease",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)")}
                                onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                              >
                                <div style={{
                                  width: "24px",
                                  height: "24px",

                                  borderRadius: "6px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#667eea",
                                }}><img src={login} alt="ss" width="25px" /></div>
                                Login / Register
                              </Link>
                            </>)}
                        </div>

                      )}

                      {/* Animations */}
                      <style>
                        {`
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}
                      </style>
                    </div>
                  </div>
                )}
              </div>








              {/* <!-- ------------------mobile media--------- --> */}
              {isMobile && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    padding: "8px 10px"
                  }}
                >
                  {/* Menu Icon - Left */}
                  <div
                    id="menu-icon"
                    className="menu-icon hidden-lg-up"
                    onClick={() => setIsSidebarOpen(true)}
                    style={{ cursor: "pointer", color: "black" }}
                  >
                    <i className="fa fa-bars" aria-hidden="true"></i>
                  </div>

                  <Link to="/">
                    <img
                      className="logo img-responsive"
                      src={thridle}
                      alt="Demo Shop"
                      style={{ height: "40px" }}
                    />
                  </Link>

                  {/* Wishlist + Cart - Right */}
                  <div
                    className="header-icons"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px"
                    }}
                  >
                    {/* Wishlist Icon */}
                    <div
                      onClick={() => navigate("/wishlist")}
                      style={{ cursor: "pointer", color: "black" }}
                    >
                      <i className="material-icons">favorite_border</i>
                    </div>

                    {/* Cart Icon */}
                    <div
                      onClick={() => navigate("/cart-page")}
                      style={{
                        cursor: "pointer",
                        color: "black",
                        position: "relative"
                      }}
                    >
                      <ShoppingBagIcon />
                      {cartCount > 0 && isLoggedIn && (
                        <span
                          style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-10px",
                            background: "#EB4D7F",
                            color: "#fff",
                            borderRadius: "50%",
                            fontSize: "12px",
                            padding: "2px 6px"
                          }}
                        >
                          {cartCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </header>

      <div
        id="mobile_top_menu_wrapper"
        className={`mobile-menu-wrapper ${isSidebarOpen ? 'open' : ''}`}
      >
        {/* Overlay with fade transition */}
        <div
          className={`mobile-menu-overlay ${isSidebarOpen ? 'visible' : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* The actual menu */}
        <div className={`mobile-menu-container ${isSidebarOpen ? 'visible' : ''}`}>
          {/* Menu header with close button */}
          <div className="mobile-menu-header">
            <div className="mobile-menu-logo">
              <img
                src={thridle}
                alt="Logo"
                style={{ height: "40px" }}
              />
            </div>
            <button
              className="mobile-menu-close"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
            >
              <i className="material-icons">close</i>
            </button>
          </div>

          {/* User section if logged in */}
          {isLoggedIn && (
            <div className="mobile-user-section">
              <div className="mobile-user-avatar">
                <i className="material-icons">account_circle</i>
              </div>
              <div className="mobile-user-info">
                <span className="mobile-user-name">My Account</span>
                <span className="mobile-user-email">Welcome back!</span>
              </div>
            </div>
          )}

          {/* Main menu items */}
          <ul className="mobile-menu-list">
            <li>
              <Link
                to="/"
                className="mobile-menu-item"
                onClick={() => setIsSidebarOpen(false)}
              >
                <i className="material-icons">home</i>
                <span>Home</span>
              </Link>
            </li>

            <li>
              <Link
                to="/about-us"
                className="mobile-menu-item"
                onClick={() => setIsSidebarOpen(false)}
              >
                <i className="material-icons">info</i>
                <span>About Us</span>
              </Link>
            </li>

            {/* Categories with expandable submenu */}
            <li className="mobile-menu-category">
              <div
                className="mobile-menu-item"
                onClick={() => {
                  const el = document.querySelector('.mobile-submenu-list');
                  el.style.display = el.style.display === 'block' ? 'none' : 'block';
                }}
              >
                <i className="material-icons">category</i>
                <span>Categories</span>
                <i className="material-icons arrow">chevron_right</i>
              </div>

              <ul className="mobile-submenu-list">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.id}`}
                      className="mobile-submenu-item"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <Link
                to="/new"
                className="mobile-menu-item"
                onClick={() => setIsSidebarOpen(false)}
              >
                <i className="material-icons">info</i>
                <span>New Arrivals</span>
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="mobile-menu-item"
                onClick={() => setIsSidebarOpen(false)}
              >
                <i className="material-icons">contact_mail</i>
                <span>Contact</span>
              </Link>
            </li>

            {/* Conditional login/logout */}
            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="mobile-menu-item"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <i className="material-icons">person</i>
                    <span>My Profile</span>
                  </Link>
                </li>
                <li>
                  <div
                    className="mobile-menu-item"
                    onClick={handleLogout}
                  >
                    <i className="material-icons">logout</i>
                    <span>Logout</span>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="mobile-menu-item"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <i className="material-icons">login</i>
                    <span>Login</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="mobile-menu-item"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <i className="material-icons">person_add</i>
                    <span>Register</span>
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Footer section */}
          <div className="mobile-menu-footer">
            <div className="mobile-menu-promo">
              <div className="promo-item">
                <i className="material-icons">card_giftcard</i>
                <span>Free Gift Voucher</span>
              </div>
              <div className="promo-item">
                <i className="material-icons">monetization_on</i>
                <span>Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ padding: "15px" }}>
              <div className="modal-header" style={{ borderBottom: "none" }}>
                <h3 className="modal-title">Confirm Deletion</h3>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowDeleteModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p style={{ fontSize: "16px", textAlign: "start" }}>
                  Are you sure you want to remove this product from your cart?
                </p>
              </div>
              <div className="modal-footer" style={{ borderTop: "none", display: "flex", justifyContent: "center" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    backgroundColor: "#48B7FF",
                    color: "white",
                    padding: "8px 20px",
                    width: "100px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={async () => {
                    if (cartIdToDelete) {
                      await removeProduct(cartIdToDelete);
                      setShowDeleteModal(false);
                      setCartIdToDelete(null);
                    }
                  }}
                  style={{
                    backgroundColor: "#EB4D7F",
                    color: "white",
                    padding: "8px 20px",
                    width: "100px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
