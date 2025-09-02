import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import thridle from "../../public/assets/THRIDLE.png";
import "./Header.css"

const Header = () => {
  const authToken = localStorage.getItem("authToken")|| "Guest";
  const [isMobile, setIsMobile] = useState(false);
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
      setIsMobile(window.innerWidth <= 768); // You can adjust the breakpoint
    };

    handleResize(); // Set initially
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <header id="header" className="home">
        <div className="header-nav">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 left-nav">
                {/* <!-- Block search  --> */}

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
                        className="ui-autocomplete-input"
                        autocomplete="off"
                        type="text"
                      />
                      <button type="submit">
                        <i className="material-icons search"></i>
                      </button>
                    </form>
                  </div>
                </div>
            
              </div>
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 right-nav">
                <div className="userinfo-inner">
                  <ul className="userinfo">
                    {authToken ? (
                      <li className="profile">
                        <Link to="/profile">Profile</Link>
                      </li>
                    ) : (
                      <>
                        <li className="log-in">
                          <Link to="/" id="customer_login_link">
                            Log in
                          </Link>
                        </li>
                        <li className="create_account">
                          <Link to="/register" id="customer_register_link">
                            Create Account
                          </Link>
                        </li>
                      </>
                    )}
                    <li className="wishlist">
                      <a href="mywishlistpage.html">Wishlist</a>
                    </li>
                    <li className="checkout">
                      <a href="checkoutpage.html">Checkout</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-top">
          <div className="container">
            <div className="row">
              {/* <!-- --------------------desktop_logo------------ --> */}
              <div
                id="desktop_logo"
                className="col-lg-3 col-md-5 col-sm-12 col-xs-12"
              >
                <a href="index.html">
                  <img
                    className="logo img-responsive"
                    src={thridle}
                    alt="Demo Shop"
                    style={{ height: "50px" }}
                  />
                </a>
              </div>
              <div className="header-top-right offset-xl-2 col-xl-7 col-lg-9 col-md-7 col-sm-12 col-xs-12">
                {/* <!-- --------------------services------------ -->     */}
                <div id="ishiservices" className="ishiservicesblock">
                  {!isMobile && (
                    <OwlCarousel
                      className="ishiservices owl-carousel"
                      {...options}
                    >
                      <div className="services item">
                        <a href="#">
                          
                          <div
                            className="service-img"
                            style={{
                              backgroundImage:
                                'url("assets/images/services/1.png")',
                            }}
                          ></div>
                          <div className="service-block">
                            <div className="service-title">
                              Free Worldwide Delivery
                            </div>
                            <div className="service-desc">
                              Delivering Your Products
                            </div>
                          </div>
                        </a>
                      </div>
                      <div className="services item">
                        <a href="#">
                          <div
                            className="service-img"
                            style={{
                              backgroundImage:
                                'url("assets/images/services/2.png")',
                            }}
                          ></div>
                          <div className="service-block">
                            <div className="service-title">
                              Free Gift Voucher
                            </div>
                            <div className="service-desc">Win Gifts</div>
                          </div>
                        </a>
                      </div>
                      <div className="services item">
                        <a href="#">
                          <div
                            className="service-img"
                            style={{
                              backgroundImage:
                                'url("assets/images/services/3.png")',
                            }}
                          ></div>
                          <div className="service-block">
                            <div className="service-title">
                              Money Back Guarantee
                            </div>
                            <div className="service-desc">Easy Returns</div>
                          </div>
                        </a>
                      </div>
                      <div className="services item">
                        <a href="#">
                          <div
                            className="service-img"
                            style={{
                              backgroundImage:
                                'url("assets/images/services/4.png")',
                            }}
                          ></div>
                          <div className="service-block">
                            <div className="service-title">
                              24X7 Support Assistance
                            </div>
                            <div className="service-desc">
                              24X7 Support Assistance
                            </div>
                          </div>
                        </a>
                      </div>
                    </OwlCarousel>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="nav-full-width">
          <div className="container">
            <div className="row">
              {/* <!-- ------------------mega menu----------- --> */}
              <div
                id="_desktop_top_menu"
                className="menu js-top-menu hidden-sm-down"
              >
                <ul className="top-menu" id="top-menu" data-depth="0">
                  <li className="cms-page" id="category-12">
                    <Link className="dropdown-item" to="/home">
                      Home
                    </Link>
                  </li>
                  {/* <li className="category" id="category-13">
                    <a
                      className="dropdown-item"
                      href="index.html"
                      data-depth="0"
                    >
                      Homepages
                    </a>
                    <span className="float-xs-right hidden-lg-up">
                      <span
                        data-target="#top_sub_menu_43175"
                        data-toggle="collapse"
                        className="navbar-toggler collapse-icons"
                      >
                        <i className="material-icons add"></i>
                        <i className="material-icons remove"></i>
                      </span>
                    </span>
                    <div
                      className="popover sub-menu collapse"
                      id="top_sub_menu_43175"
                    >
                      <ul className="top-menu" data-depth="1">
                        <li className="category" id="category-131">
                          <Link className="dropdown-item" to="/ss">
                            Homepages
                          </Link>
                          <span className="float-xs-right hidden-lg-up">
                            <span
                              data-target="#top_sub_menu_127"
                              data-toggle="collapse"
                              className="navbar-toggler collapse-icons"
                            >
                              <i className="material-icons add"></i>
                              <i className="material-icons remove"></i>
                            </span>
                          </span>
                          <div className="collapse" id="top_sub_menu_127">
                            <ul className="top-menu" data-depth="2">
                              <li className="category" id="category-130">
                                <a
                                  className="dropdown-item"
                                  href="index.html"
                                  data-depth="2"
                                >
                                  Home Layout 1
                                </a>
                              </li>
                              <li className="category" id="category-128">
                                <a
                                  className="dropdown-item"
                                  href="https://demo.ishithemes.com/html/toytown/Layout002/index.html"
                                  data-depth="2"
                                >
                                  Home Layout 2
                                </a>
                              </li>
                              <li className="category" id="category-129">
                                <a
                                  className="dropdown-item"
                                  href="https://demo.ishithemes.com/html/toytown/Layout003/index.html"
                                  data-depth="2"
                                >
                                  Home Layout 3
                                </a>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </li> */}
                  {/* <li className="category" id="category-3">
                    <a
                      className="dropdown-item"
                      href="categorypage_leftcolumn.html"
                      data-depth="0"
                    >
                      Included Pages
                    </a>
                    <span className="float-xs-right hidden-lg-up">
                      <span
                        data-target="#top_sub_menu_37079"
                        data-toggle="collapse"
                        className="navbar-toggler collapse-icons"
                      >
                        <i className="material-icons add"></i>
                        <i className="material-icons remove"></i>
                      </span>
                    </span>
                    <div
                      className="popover sub-menu collapse"
                      id="top_sub_menu_37079"
                    >
                      <ul className="top-menu" data-depth="1">
                        <li className="category" id="category-4">
                          <a
                            className="dropdown-item dropdown-submenu"
                            href="productpage_leftcolumn.html"
                            data-depth="1"
                          >
                            Product pages
                          </a>
                          <span className="float-xs-right hidden-lg-up">
                            <span
                              data-target="#top_sub_menu_40183"
                              data-toggle="collapse"
                              className="navbar-toggler collapse-icons"
                            >
                              <i className="material-icons add"></i>
                              <i className="material-icons remove"></i>
                            </span>
                          </span>
                          <div className="collapse" id="top_sub_menu_40183">
                            <ul className="top-menu" data-depth="2">
                              <li className="category" id="category-5">
                                <Link className="dropdown-item" to="/product">
                                  Product Full Width
                                </Link>
                              </li>
                              <li className="category" id="category-6">
                                <a
                                  className="dropdown-item"
                                  href="productpage_leftcolumn.html"
                                  data-depth="2"
                                >
                                  Product Left Column
                                </a>
                              </li>
                              <li className="category" id="category-7">
                                <a
                                  className="dropdown-item"
                                  href="productpage_rightcolumn.html"
                                  data-depth="2"
                                >
                                  Product Right Column
                                </a>
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li className="category" id="category-8">
                          <a
                            className="dropdown-item dropdown-submenu"
                            href="categorypage_leftcolumn.html"
                            data-depth="1"
                          >
                            Category Pages
                          </a>
                          <span className="float-xs-right hidden-lg-up">
                            <span
                              data-target="#top_sub_menu_71335"
                              data-toggle="collapse"
                              className="navbar-toggler collapse-icons"
                            >
                              <i className="material-icons add"></i>
                              <i className="material-icons remove"></i>
                            </span>
                          </span>
                          <div className="collapse" id="top_sub_menu_71335">
                            <ul className="top-menu" data-depth="2">
                              <li className="category" id="category-9">
                                <a
                                  className="dropdown-item"
                                  href="categorypage_fullwidth.html"
                                  data-depth="2"
                                >
                                  Category Full Width
                                </a>
                              </li>
                              <li className="category" id="category-10">
                                <Link className="dropdown-item" to="/category">
                                  Category Left Column
                                </Link>
                              </li>
                              <li className="category" id="category-11">
                                <a
                                  className="dropdown-item"
                                  href="categorypage_rightcolumn.html"
                                  data-depth="2"
                                >
                                  Category Right Column
                                </a>
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li className="category" id="category-14">
                          <a
                            className="dropdown-item dropdown-submenu"
                            href="cartpage.html"
                            data-depth="1"
                          >
                            miscellaneous pages
                          </a>
                          <span className="float-xs-right hidden-lg-up">
                            <span
                              data-target="#top_sub_menu_17740"
                              data-toggle="collapse"
                              className="navbar-toggler collapse-icons"
                            >
                              <i className="material-icons add"></i>
                              <i className="material-icons remove"></i>
                            </span>
                          </span>
                          <div className="collapse" id="top_sub_menu_17740">
                            <ul className="top-menu" data-depth="2">
                              <li className="category" id="category-15">
                                <a
                                  className="dropdown-item"
                                  href="404_page.html"
                                  data-depth="2"
                                >
                                  404 page
                                </a>
                              </li>
                              <li className="category" id="category-16">
                                <a
                                  className="dropdown-item"
                                  href="checkoutpage.html"
                                  data-depth="2"
                                >
                                  Checkout
                                </a>
                              </li>
                              <li className="category" id="category-17">
                                <a
                                  className="dropdown-item"
                                  href="maintenancepage.html"
                                  data-depth="2"
                                >
                                  Maintenance Page
                                </a>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                      <img
                        className="category-image"
                        src="assets/images/category-dropdown.jpg"
                        alt="category-image"
                        title="Women"
                      />
                    </div>
                  </li> */}
                  <li className="cms-page" id="cms-page-4">
                    {/* <a className="dropdown-item" href="about-us.html" data-depth="0"> */}
                    <Link
                      to="/about-us"
                      className="dropdown-item"
                      data-depth="0"
                    >
                      About us
                    </Link>
                  </li>
                  <li className="cms-page" id="cms-page-4">
                    {/* <a className="dropdown-item" href="about-us.html" data-depth="0"> */}
                    <Link
                      to="/category-page"
                      className="dropdown-item"
                      data-depth="0"
                    >
                      Category
                    </Link>
                  </li>
                  {/* <li className="category" id="category-1111">
                    <a
                      className="dropdown-item"
                      href="categorypage_leftcolumn.html"
                      data-depth="0"
                    >
                      Extras
                    </a>
                    <span className="float-xs-right hidden-lg-up">
                      <span
                        data-target="#top_sub_menu_122"
                        data-toggle="collapse"
                        className="navbar-toggler collapse-icons"
                      >
                        <i className="material-icons add"></i>
                        <i className="material-icons remove"></i>
                      </span>
                    </span>
                    <div
                      className="popover sub-menu collapse"
                      id="top_sub_menu_122"
                    >
                      <ul className="top-menu" data-depth="1">
                        <li className="category" id="category-18">
                          <a
                            className="dropdown-item dropdown-submenu"
                            href="blog_leftcolumn.html"
                            data-depth="1"
                          >
                            Blog Pages
                          </a>
                          <span className="float-xs-right hidden-lg-up">
                            <span
                              data-target="#top_sub_menu_11087"
                              data-toggle="collapse"
                              className="navbar-toggler collapse-icons"
                            >
                              <i className="material-icons add"></i>
                              <i className="material-icons remove"></i>
                            </span>
                          </span>
                          <div className="collapse" id="top_sub_menu_11087">
                            <ul className="top-menu" data-depth="2">
                              <li className="category" id="category-20">
                              
                                <Link
                                  className="dropdown-item"
                                  data-depth="2"
                                  to="/single-blog"
                                >
                                  Single blog page
                                </Link>
                              </li>
                              <li className="category" id="category-21">
                              
                                <Link
                                  to="/blog-left-col"
                                  className="dropdown-item"
                                  data-depth="2"
                                >
                                  Blogs Left Column
                                </Link>
                              </li>
                              <li className="category" id="category-22">
                                <a
                                  className="dropdown-item"
                                  href="blog_rightcolumn.html"
                                  data-depth="2"
                                >
                                  Blogs Right Column
                                </a>
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li className="category" id="category-19">
                          <a
                            className="dropdown-item dropdown-submenu"
                            href="cartpage.html"
                            data-depth="1"
                          >
                            miscellaneous pages
                          </a>
                          <span className="float-xs-right hidden-lg-up">
                            <span
                              data-target="#top_sub_menu_17740"
                              data-toggle="collapse"
                              className="navbar-toggler collapse-icons"
                            >
                              <i className="material-icons add"></i>
                              <i className="material-icons remove"></i>
                            </span>
                          </span>
                          <div className="collapse" id="top_sub_menu_17740">
                            <ul className="top-menu" data-depth="2">
                              <li className="category" id="category-15">
                           
                                <Link
                                  to="/error"
                                  className="dropdown-item"
                                  data-depth="2"
                                >
                                  404 page
                                </Link>
                              </li>
                              <li className="category" id="category-16">
                            
                                <Link
                                  to="/check-out"
                                  className="dropdown-item"
                                  data-depth="2"
                                >
                                  Checkout
                                </Link>
                              </li>
                              <li className="category" id="category-17">
                                <a
                                  className="dropdown-item"
                                  href="maintenancepage.html"
                                  data-depth="2"
                                >
                                  Maintenance Page
                                </a>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </li> */}
                  <li className="cms-page" id="cms-page-1">
                    {/* <a className="dropdown-item" href="contactpage.html" data-depth="0"> */}
                    <Link to="/contact">Contact us</Link>
                  </li>
                </ul>
                <div className="clearfix"></div>
              </div>

{/* <!-- ------------------Search----------- --> */}
           



              {/* <!-- -------------------shopping cart----------- --> */}
              <div id="_desktop_cart" >

              <style>
  {`
    #search_widget input::placeholder {
      color: #fff;
      opacity: 1;
    }
  `}
</style>
              <div id="_desktop_seach_widget">
                  <div id="search_widget" className="search-widget" >
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
                      <input name="controller"  style={{color:"#fff"}} value="search" type="hidden" />
                      <span
                        role="status"
                        aria-live="polite"
                        className="ui-helper-hidden-accessible"
                        style={{color:"#fff"}}
                      ></span>
                    <input
      name="s"
      value=""
      style={{ color: "#fff" }}
      placeholder="Search our catalog"
      className="ui-autocomplete-input"
      autoComplete="off"
      type="text"
    />
                      <button type="submit" style={{color:"#fff"}}>
                        <i className="material-icons search"></i>
                      </button>
                    </form>
                  </div>
                </div>
                <div className="blockcart cart-preview inactive">

                  
                  <div className="header">
                    <span className="cart-link">
                      <span className="cart-img">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ display: "none" }}
                        >
                          <symbol id="shopping-cart" viewBox="0 0 850 850">
                            <title>shopping-cart</title>
                            <path
                              d="M194.59,382.711c-35.646,0-64.646,29-64.646,64.646s29,64.646,64.646,64.646c35.646,0,64.646-29,64.646-64.646
                            S230.235,382.711,194.59,382.711z M194.59,473.215c-14.261,0-25.858-11.597-25.858-25.858c0-14.261,11.597-25.858,25.858-25.858
                            c14.254,0,25.858,11.597,25.858,25.858C220.448,461.617,208.851,473.215,194.59,473.215z"
                            ></path>
                            <path
                              d="M385.941,382.711c-35.646,0-64.646,29-64.646,64.646s29,64.646,64.646,64.646c35.646,0,64.646-29,64.646-64.646
                            S421.587,382.711,385.941,382.711z M385.941,473.215c-14.261,0-25.858-11.597-25.858-25.858
                            c0-14.261,11.597-25.858,25.858-25.858c14.261,0,25.858,11.597,25.858,25.858C411.799,461.617,400.202,473.215,385.941,473.215z"
                            ></path>
                            <path
                              d="M498.088,126.274c-3.685-4.629-9.27-7.324-15.179-7.324H143.326l-17.629-89.095c-1.545-7.803-7.699-13.873-15.528-15.308
                            L32.594,0.325C22.038-1.621,11.953,5.368,10.02,15.905s5.042,20.641,15.58,22.574l64.607,11.843l56.914,287.667
                            c1.797,9.083,9.768,15.631,19.025,15.631h271.512c9.031,0,16.86-6.225,18.896-15.037l45.252-195.876
                            C503.137,136.947,501.767,130.896,498.088,126.274z M422.233,314.833H182.074l-31.075-157.089h307.519L422.233,314.833z"
                            ></path>
                          </symbol>
                        </svg>
                        <svg className="icon" viewBox="0 0 40 40">
                          <use href="#shopping-cart" x="15%" y="18%"></use>
                        </svg>
                      </span>
                      <span className="cart-content">
                        <span className="cart-name">
                          <span className="cart-products-count">3</span> items
                        </span>
                        <span className="cart-products-count hidden-lg-up">
                          3
                        </span>
                      </span>
                    </span>
                    <div className="cart-dropdown">
                      <div className="product-container">
                        <div className="product">
                          <a className="product-image" href="#">
                            <img
                              src="assets/images/product/1.jpg"
                              alt="Simul dolorem voluptaria"
                            />
                          </a>
                          <div className="product-detail">
                            <div className="product-name">
                              <span className="quantity-formated">
                                <span className="quantity">1</span>
                                &nbsp;x&nbsp;
                              </span>
                              <a className="cart_block_product_name" href="#">
                                Simul dolorem voluptaria
                              </a>
                            </div>
                            <div className="price">$16.51</div>
                            <ul className="product-atributes">
                              <li className="atributes">
                                <span className="label">Size:</span>
                                <span className="value">S</span>
                              </li>
                              <li className="atributes">
                                <span className="label">Color:</span>
                                <span className="value">Orange</span>
                              </li>
                            </ul>
                          </div>
                          <div className="remove-product">
                            <a
                              className="remove-from-cart"
                              rel="nofollow"
                              href="#"
                            >
                              <i className="material-icons">delete</i>
                            </a>
                          </div>
                        </div>
                        <div className="product">
                          <a className="product-image" href="#">
                            <img
                              src="assets/images/product/3.jpg"
                              alt="Omnis dicam mentitum"
                            />
                          </a>
                          <div className="product-detail">
                            <div className="product-name">
                              <span className="quantity-formated">
                                <span className="quantity">1</span>
                                &nbsp;x&nbsp;
                              </span>
                              <a className="cart_block_product_name" href="#">
                                Omnis dicam mentitum
                              </a>
                            </div>
                            <div className="price">$25.99</div>
                            <ul className="product-atributes">
                              <li className="atributes">
                                <span className="label">Size:</span>
                                <span className="value">S</span>
                              </li>
                              <li className="atributes">
                                <span className="label">Color:</span>
                                <span className="value">Orange</span>
                              </li>
                            </ul>
                          </div>
                          <div className="remove-product">
                            <a
                              className="remove-from-cart"
                              rel="nofollow"
                              href="#"
                            >
                              <i className="material-icons">delete</i>
                            </a>
                          </div>
                        </div>
                        <div className="product">
                          <a className="product-image" href="#">
                            <img
                              src="assets/images/product/5.jpg"
                              alt="Eled doming deserunt"
                            />
                          </a>
                          <div className="product-detail">
                            <div className="product-name">
                              <span className="quantity-formated">
                                <span className="quantity">1</span>
                                &nbsp;x&nbsp;
                              </span>
                              <a className="cart_block_product_name" href="#">
                                Eled doming deserunt
                              </a>
                            </div>
                            <div className="price">$28.98</div>
                            <ul className="product-atributes">
                              <li className="atributes">
                                <span className="label">Size:</span>
                                <span className="value">S</span>
                              </li>
                              <li className="atributes">
                                <span className="label">Color:</span>
                                <span className="value">Yellow</span>
                              </li>
                            </ul>
                          </div>
                          <div className="remove-product">
                            <a
                              className="remove-from-cart"
                              rel="nofollow"
                              href="#"
                            >
                              <i className="material-icons">delete</i>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="billing-info">
                        <div className="billing subtotal-info">
                          <span className="label">Subtotal</span>
                          <span className="value">$71.48</span>
                        </div>
                        <div className="billing shipping-info">
                          <span className="label">Shipping</span>
                          <span className="value">$7.00</span>
                        </div>
                        <div className="billing tax-info">
                          <span className="label">Taxes</span>
                          <span className="value">$0.00</span>
                        </div>
                        <div className="billing total-info">
                          <span className="label">Total</span>
                          <span className="value">$78.48</span>
                        </div>
                      </div>
                      <div className="cart-btn col-xs-12">
                        <a
                          href="checkoutpage.html"
                          className="btn btn-primary checkout"
                        >
                          Checkout
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              
            
              {/* <!-- ------------------mobile media--------- --> */}
              <div id="menu-icon" className="menu-icon hidden-lg-up">
                <i className="fa fa-bars" aria-hidden="true"></i>
              </div>
              <div id="_mobile_cart"></div>
              <div id="_mobile_seach_widget"></div>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </header>

      <div
        id="mobile_top_menu_wrapper"
        className="hidden-lg-up"
        style={{ display: "none" }}
      >
        <div id="top_menu_closer">
          <i className="material-icons"></i>
        </div>
        <div className="js-top-menu mobile" id="_mobile_top_menu"></div>
      </div>
    </div>
  );
};

export default Header;
