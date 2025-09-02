import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const categorySliderOptions = {
  loop: false,
  margin: 10,
  nav: true,
  dots: false,
  responsive: {
    0: { items: 2 },
    600: { items: 3 },
    1000: { items: 5 },
  },
};

const SubSubCategory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state?.data;

  // Redirect if no category is passed
  if (!category) {
    navigate("/");
    return null;
  }

  const subSubCategories = category.subCategories || [];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb-container">
        <nav data-depth="2" className="breadcrumb container">
          <h1 className="h1 category-title breadcrumb-title">Sub-Sub-Categories</h1>
          <ul>
            <li>
              <a href="#"><span>Home</span></a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sub-Sub-Category Section */}
      <section id="ishicategory" className="ishicategoryblock">
        <div style={{ display: "flex", justifyContent: "center" }}>
          {subSubCategories.length > 0 ? (
            <OwlCarousel
              className="owl-theme ishicategoryblock-carousel"
              {...categorySliderOptions}
              style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
            >
              {subSubCategories?.map((sub, index) => {
                const imgUrl =
                  sub.icon && sub.icon !== "null"
                    ? `https://thridle.com/ecom/storage/app/public/category/${sub.icon}`
                    : "/assets/images/category/default.png";

                return (
                  <div key={index} className="image-container">
                    <div className="item" style={{ cursor: "pointer" }}>
                      <img
                        src={"https://static.vecteezy.com/system/resources/thumbnails/047/241/958/small/blue-sweatshirt-isolated-on-transparent-background-free-png.png"}
                        alt={sub.name}
                        className="img-responsive"
                        style={{
                          width: "100%",
                          height: "160px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <div
                        className="text-container"
                        style={{ textAlign: "center", marginTop: "8px" }}
                      >
                        {sub.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </OwlCarousel>
          ) : (
            <div style={{ marginTop: "30px", textAlign: "center", fontSize: "1.2rem", color: "#888" }}>
              🚫 No Sub-Sub-Categories Found
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SubSubCategory;
