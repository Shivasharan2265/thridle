import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import thridle from "../../public/assets/THRIDLE.png";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({});
  const [socialLinks, setSocialLinks] = useState([]);

  const authToken = localStorage.getItem("authToken");

  const isLoggedIn = !!authToken && authToken !== "Guest";

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      const fd = new FormData();
      fd.append("authToken", localStorage.getItem("authToken") || "Guest");
      fd.append("programType", "getCompanyDetails");

      try {
        const response = await api.post("/ecom/company", fd);
        // console.log("response", response);
        if (response?.data?.success) {
          const details = response.data.data;
          const dataMap = {};
          details.forEach((item) => {
            dataMap[item.type] = item.value;
          });
          setCompanyData(dataMap);
        }
      } catch (error) {
        console.error("Company API Error:", error);
      }
    };

    fetchCompanyDetails();
  }, []);

  useEffect(() => {
    const fetchTerms = async () => {
      const fd = new FormData();
      fd.append("authToken", localStorage.getItem("authToken") || "Guest");
      fd.append("programType", "getBusinessPages");

      try {
        const response = await api.post("/ecom/settings", fd);
        console.log("terms n conditions", response);
      } catch (error) {
        console.error("Company API Error:", error);
      }
    };

    fetchTerms();
  }, []);

  useEffect(() => {
    const socialMedia = async () => {
      const fd = new FormData();
      fd.append("authToken", localStorage.getItem("authToken") || "Guest");
      fd.append("programType", "getSocialMediaLinks");

      try {
        const response = await api.post("/ecom/settings", fd);
        if (response?.data?.success) {
          setSocialLinks(response.data.data); // Save links to state

          console.log(socialLinks);
        }
      } catch (error) {
        console.error("Social Media API Error:", error);
      }
    };

    socialMedia();
  }, []);

  return (
    <footer id="footer">
      <div className="footer-container">
        <div className="container">
          <div className="row">
            {/* Store Info */}
            <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
              <div className="ishistoreinfo-inner">
                <a href="index.html" className="store-logo">
                  <img
                    src={
                      companyData.company_footer_logo
                        ? `https://thridle.com/ecom/storage/app/public/company/${
                            JSON.parse(companyData.company_footer_logo)
                              .image_name
                          }`
                        : thridle
                    }
                    alt="Company Logo"
                    style={{ height: "80px", width: "180px" }}
                  />
                </a>

                <p
                  className="store-description mt-2 p-3"
                  style={{ marginLeft: "-6px", color: "black" }}
                >
                  {"From Baby Steps to Big Moments — Comfort That Grows with You." ||
                    "Your company tagline goes here."}
                </p>
              </div>
            </div>

            {/* Your Account */}
            <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 links wrapper footer-block">
              <h3 className="title_block" style={{ fontWeight: "800" }}>
                Links
              </h3>
              <ul className="footer-dropdown" style={{ marginTop: "20px" }}>
                <li>
                  <a href="/page/about-us">About Us</a>
                </li>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      isLoggedIn
                        ? (window.location.href = "/profile")
                        : toast.error("Please login to proceed");
                    }}
                  >
                    Personal info
                  </a>
                </li>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      isLoggedIn
                        ? (window.location.href = "/history")
                        : toast.error("Please login to proceed");
                    }}
                  >
                    Orders
                  </a>
                </li>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      isLoggedIn
                        ? (window.location.href = "/profile")
                        : toast.error("Please login to proceed");
                    }}
                  >
                    Addresses
                  </a>
                </li>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      isLoggedIn
                        ? (window.location.href = "/wishlist")
                        : toast.error("Please login to proceed");
                    }}
                  >
                    My Wishlists
                  </a>
                </li>

                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/faq")}
                  >
                    FAQ's
                  </a>
                </li>
              </ul>
            </div>

            {/* Product */}
            <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 links wrapper footer-block">
              <h3 className="title_block" style={{ fontWeight: "800" }}>
                Shipping & Policy
              </h3>
              <ul className="footer-dropdown" style={{ marginTop: "20px" }}>
                <li>
                  <a href="/page/terms-and-conditions">Terms & Conditions</a>
                </li>

                <li>
                  <a href="/page/privacy-policy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/page/return-policy">Return & Refund Policy</a>
                </li>
                <li>
                  <a href="/page/cancellation-policy">Cancellation Policy</a>
                </li>
                <li>
                  <a href="/page/shipping-policy">Shipping Policy</a>
                </li>
              </ul>
            </div>

            {/* Store Information */}
            <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 links wrapper footer-block">
              <h3 className="title_block" style={{ fontWeight: "800" }}>
                Store Information
              </h3>

              <div
                className="footer-contact"
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {companyData.company_phone && (
                  <div
                    className="block phone"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <a className="icon">
                      <i
                        className="material-icons"
                        style={{ fontSize: "22px" }}
                      >
                        phone
                      </i>
                    </a>
                    <div className="content" style={{ fontSize: "14px" }}>
                      <a
                        href={`tel:${companyData.company_phone}`}
                        style={{ textDecoration: "none" }}
                      >
                        {companyData.company_phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Email */}
                {companyData.company_email && (
                  <div
                    className="block email"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <a className="icon">
                      <i
                        className="material-icons"
                        style={{ fontSize: "22px" }}
                      >
                        email
                      </i>
                    </a>
                    <div className="content" style={{ fontSize: "14px" }}>
                      <a
                        href={`mailto:${companyData.company_email}`}
                        style={{ textDecoration: "none" }}
                      >
                        {companyData.company_email}
                      </a>
                    </div>
                  </div>
                )}
                <ul
                  style={{
                    display: "flex",
                    gap: "15px",
                    listStyle: "none",
                    padding: 0,
                  }}
                >
                  <li>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Facebook"
                      style={{ color: "#3b5998", fontSize: "20px" }}
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Instagram"
                      style={{ color: "#E1306C", fontSize: "20px" }}
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/your-number"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="WhatsApp"
                      style={{ color: "#25D366", fontSize: "20px" }}
                    >
                      <i className="fab fa-whatsapp"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="YouTube"
                      style={{ color: "#FF0000", fontSize: "20px" }}
                    >
                      <i className="fab fa-youtube"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://x.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="X (Twitter)"
                      style={{ color: "#000000", fontSize: "20px" }}
                    >
                      <i className="fab fa-x-twitter"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Disclaimer Section */}
        <div
          className="container"
          style={{
            // backgroundColor: "#f8f8f8",
            padding: "30px",
            fontSize: "13px",
            color: "black",
            borderTop: "1px solid #ddd",
            marginTop: "20px",
            fontFamily: "sans-serif",
            textAlign: "justify",
          }}
        >
          <strong>Disclaimer:</strong> We have made a consistent effort to make
          the colours and finishes similar to the Image of the products you see
          on screen. However, the actual product and the images on the website
          can differ! Customer's discretion is advised. The products in the
          image are for illustration purposes. Please refer{" "}
          <em>"items included in package"</em> to understand what is inclusive
          of the price.
          <br />
          <strong>Note:</strong> To confirm sizes please refer to the
          measurement link available at size chart above.
        </div>

        {/* Footer Bottom */}
        <div className="footer-after">
          <div className="container"></div>
        </div>
      </div>

      <a id="slidetop" href="#"></a>

      <div
        style={{
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="footer-containe container mt-3">
          <p style={{ color: "black", marginBottom: "0" }}>
            © Copyright Thridle 2025, All Right Reserved
          </p>
          <p>
            <a
              href="https://beingmash.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "black",
                marginBottom: "0",
                fontFamily:"inherit"
              }}
            >
              Designed by: BeingMash Services Pvt Ltd
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
