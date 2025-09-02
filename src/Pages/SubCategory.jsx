import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "./CategoryPage.css";
import "./SubCategories.css"
import { Link, useNavigate, useParams } from "react-router-dom";

const SubCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams()

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const fd = new FormData();
    fd.append(
      "authToken",
      localStorage.getItem("authToken") || "Guest"
    );
    fd.append("programType", "getSubAndSubSubCategory");
    fd.append("id", id);

    try {
      const response = await api.post("/ecom/category", fd);
      console.log(response, "response");
      if (response?.data?.success && response.data.data?.category?.subCategories) {
        setCategories(response.data.data.category.subCategories);
      }

    } catch (error) {
      console.error("Category API Error:", error);
    } finally {
      setLoading(false); // stop loader
    }
  };

  const placeholderImages = [
    "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-blank-t-shirt-pink-crew-neck-short-sleeve-for-kids-png-image_9193430.png",
    "https://static.vecteezy.com/system/resources/previews/047/654/982/non_2x/adorable-baby-shirts-cute-and-comfortable-styles-for-little-ones-free-png.png",
    "https://png.pngtree.com/png-vector/20240801/ourmid/pngtree-solid-color-baby-boys-sweatpants-with-convenient-pockets-and-drawstring-closure-png-image_13326052.png",
  ];

  return (
    <div>
      <div className="wishlist-header">
                <div className="container">
                    <nav className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>Sub Categories</span>
                    </nav>
                </div>
            </div>
<section
  id="ishispecialproducts"
  className="container"
  style={{ marginTop: "30px" }}
>
  <div
    className="block_content row"
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "30px",
      justifyContent: "center",
    }}
  >
    {loading ? (
      // Skeleton loader
      Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="product-thumb"
          style={{
            width: "260px",
            minHeight: "360px",
            borderRadius: "10px",
            backgroundColor: "#f2f2f2",
            animation: "pulse 1.5s infinite",
          }}
        >
          <div
            style={{
              height: "200px",
              backgroundColor: "#e0e0e0",
            }}
          ></div>
          <div style={{ padding: "16px" }}>
            <div
              style={{
                height: "20px",
                backgroundColor: "#ddd",
                marginBottom: "8px",
              }}
            ></div>
            <div
              style={{
                height: "16px",
                backgroundColor: "#eee",
                width: "80%",
                margin: "0 auto",
              }}
            ></div>
          </div>
        </div>
      ))
    ) : categories.length === 0 ? (
      // No Products Found UI
      <div
        className="no-products-container"
        style={{
          width: "100%",
          padding: "20px 20px",
          textAlign: "center",
          margin: "40px 0",
        }}
      >
        <div
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ff6b6b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          </svg>
          <h2
            style={{
              color: "#2d3436",
              fontWeight: "700",
              margin: "20px 0 10px",
              fontSize: "24px",
            }}
          >
            No Sub-Categories Found
          </h2>
          
          <button
            onClick={() => navigate("/home")}
            style={{
              backgroundColor: "#48B7FF",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    ) : (
      // Render categories
      categories.map((category, index) => {
        const imageUrl =
          placeholderImages[index % placeholderImages.length];

        return (
          <div
            key={index}
            className="product-thumb"
            onClick={() =>
              navigate(`/category/${category.parent_id}`, {
                state: { selectedSubCategories: [category.id] },
              })
            }
            style={{ cursor: "pointer", padding: "0" }}
          >
            <div className="item">
              {/* Image */}
              <div
                className="image"
                style={{
                  width: "260px",
                  minHeight: "260px",
                  borderBottom: "1px solid #ddd",
                  backgroundColor: "#fff",
                  overflow: "hidden",
                  transition: "transform 0.2s",
                }}
              >
                <a href="#" className="thumbnail product-thumbnail">
                  <img
                    src={imageUrl}
                    alt={category.name}
                    style={{
                      maxHeight: "180px",
                      width: "100%",
                      objectFit: "contain",
                      marginTop: "30px",
                    }}
                  />
                </a>
              </div>

              {/* Caption */}
              <div
                className="caption"
                style={{
                  padding: "16px",
                  textAlign: "center",
                  backgroundColor: "#48B7FF",
                }}
              >
                <p
                  className="description"
                  style={{
                    fontSize: "15px",
                    color: "#666",
                    minHeight: "50px",
                    marginBottom: "10px",
                  }}
                >
                  {category.description ||
                    "Explore products in this category."}
                </p>

                <p className="price" style={{ margin: 0 }}>
                  <span
                    className="price-sale"
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#fff",
                    }}
                  >
                    {category.name}
                  </span>
                </p>
              </div>
            </div>
          </div>
        );
      })
    )}
  </div>
</section>

    </div>
  );
};

export default SubCategory;
