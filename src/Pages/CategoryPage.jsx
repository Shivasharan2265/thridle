import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "./CategoryPage.css";
import { Link, useNavigate } from "react-router-dom";
import "./SubCategories.css"

const CategoryPage = () => {
  const navigate = useNavigate();

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
      localStorage.getItem("authToken")|| "Guest"
    );
    fd.append("programType", "getCategoryDetails");

    try {
      const response = await api.post("/ecom/category", fd);
      console.log(response, "response");
      if (response?.data?.success && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Category API Error:", error);
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div>
                 <div className="wishlist-header">
                <div className="container">
                    <nav className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>Categories</span>
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
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
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
            : categories.map((category, index) => {
                const imageUrl = category.icon
                  ? `https://thridle.com/ecom/storage/app/public/category/${category.icon}`
                  : "assets/images/category/default.png";

                return (
                  <div
                    key={index}
                    className="product-thumb"
                    onClick={() => navigate(`/sub-category/${category.id}`)}
                    style={{ cursor: "pointer", padding:"0" }}
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
                        style={{ padding: "16px", textAlign: "center", backgroundColor:"#48B7FF" }}
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
              })}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
