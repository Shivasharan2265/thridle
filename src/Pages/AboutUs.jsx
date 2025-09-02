import React from 'react'
import { Link } from 'react-router-dom'

const AboutUs = () => {
  return (
    <div>
      <div id="mobile_top_menu_wrapper" class="hidden-lg-up" style={{ display: "none" }}>
        <div id="top_menu_closer">
          <i class="material-icons"></i>
        </div>
        <div class="js-top-menu mobile" id="_mobile_top_menu"></div>
      </div>

      <div className="wishlist-header">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>About Us</span>
          </nav>
        </div>
      </div>


      <section id="wrapper">
        <div className="container">
          <div id="content-wrapper" className="col-xs-12">
            <section id="main">
              <div className="about-page">
                <div className="about-container">
                  <h2 className="home-title" style={{ borderColor: "black", color: "#EC87A7" }}>Thridle</h2>
                  <div className="row">
                    <div className="col-lg-6 col-sm-12">
                      <div className="about-us">
                        <p>
                          At <strong>Thridle</strong>, we believe every baby deserves the best start in life. Born out of love, care, and the need for trustworthy baby essentials,
                          we created an online platform that brings together quality, safety, and style — all in one place.
                        </p>
                        <p>
                          Whether you're a first-time parent, a grandparent, or shopping for a gift, we curate the finest range of baby clothing, toys,
                          accessories, and essentials to make your journey smoother and more joyful.
                        </p>
                        <p>
                          Our goal is simple — to offer thoughtfully designed, eco-conscious, and affordable products that babies love and parents trust.
                        </p>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/home'}>
                          Shop Now
                        </button>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12">
                      <a href="#"><img alt="about-img" src="assets/images/about-img.png" /></a>
                    </div>
                  </div>
                </div>

                <div className="block-title">
                  <h2 className="home-title">What Makes Us Different</h2>
                  <p>
                    From sustainable materials to safe designs and adorable styles, everything at Thridle is crafted with care and purpose.
                    We’re not just another e-commerce store — we’re a brand built around growing families.
                  </p>
                </div>

                <div className="about-services">
                  <div className="row">
                    <div className="col-lg-4 col-md-6 service">
                      <img alt="icon-1" src="assets/images/icons/icon-1.png" />
                      <h3>Parent-Approved Products</h3>
                      <p>All our products are vetted by real parents for safety, comfort, and usability.</p>
                    </div>
                    <div className="col-lg-4 col-md-6 service">
                      <img alt="icon-2" src="assets/images/icons/icon-2.png" />
                      <h3>Eco-Friendly Choices</h3>
                      <p>We strive to offer items made from sustainable materials that are gentle on your baby and the planet.</p>
                    </div>
                    <div className="col-lg-4 col-md-12 service">
                      <img alt="icon-3" src="assets/images/icons/icon-3.png" />
                      <h3>Seamless Experience</h3>
                      <p>Enjoy a responsive, easy-to-navigate platform with fast delivery and reliable support.</p>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs
