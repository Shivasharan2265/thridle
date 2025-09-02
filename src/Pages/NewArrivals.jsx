import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadProducts = async () => {
        const fd = new FormData();
        fd.append("authToken", localStorage.getItem("authToken") || "Guest");
        fd.append("programType", "getProductDetails");
        fd.append("featured", "yes");

        try {
            setError(null);
            const response = await api.post("/ecom/products", fd);

            if (
                response?.data?.success === false &&
                response?.data?.data === "Unauthorized user"
            ) {
                localStorage.removeItem("authToken");
                window.location.href = "/login";
                return;
            }

            if (response?.data?.success && Array.isArray(response.data.data)) {
                setProducts(response.data.data);
            } else {
                setError("Failed to load products");
            }
        } catch (error) {
            console.error("Product API Error:", error);
            setError("Failed to load products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const ProductCard = ({ product }) => {
        const [isHovered, setIsHovered] = useState(false);
        const [imageLoaded, setImageLoaded] = useState(false);
        const [hoverImageLoaded, setHoverImageLoaded] = useState(false);

        const imageArray = JSON.parse(product.images || "[]");
        const mainImg = product.thumbnail;
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
                className="product-card"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => navigate(`/product/${product.id}`)}
                key={product.id}
            >
                <div className="product-image-container">
                    {!imageLoaded && (
                        <div className="image-placeholder"></div>
                    )}
                    <img
                        src={`https://thridle.com/ecom/storage/app/public/product/thumbnail/${mainImg}`}
                        alt={product.name}
                        onLoad={() => setImageLoaded(true)}
                        className={imageLoaded ? 'loaded' : ''}
                    />
                    {hoverImg && (
                        <>
                            {!hoverImageLoaded && (
                                <div className="image-placeholder"></div>
                            )}
                            <img
                                className={`product-hover-image ${isHovered && hoverImageLoaded ? 'active' : ''}`}
                                src={`https://thridle.com/ecom/storage/app/public/product/${hoverImg}`}
                                alt={product.name}
                                onLoad={() => setHoverImageLoaded(true)}
                            />
                        </>
                    )}

                    {discountValue > 0 && (
                        <div className="discount-badge">
                            {discountType === "percent"
                                ? `${discountValue}% OFF`
                                : `${formatPrice(discountValue)} OFF`}
                        </div>
                    )}

                    <button
                        className="quick-view-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product.id}`);
                        }}
                    >
                        <i className="fas fa-eye"></i> Quick View
                    </button>
                </div>

                <div className="product-info">
                    <h4 className="product-title">{product.name}</h4>

                    <div className="rating">
                        {[...Array(5)].map((_, i) => (
                            <i
                                className={`fas fa-star ${i < Math.floor(product.rating || 0) ? 'filled' : ''}`}
                                key={i}
                            ></i>
                        ))}
                        <span className="rating-count">({product.reviewCount || 0})</span>
                    </div>

                    <div className="price-container">
                        {originalPrice ? (
                            <>
                                <span className="current-price">{formatPrice(finalPrice)}</span>
                                <span className="original-price">{formatPrice(originalPrice)}</span>
                            </>
                        ) : (
                            <span className="current-price">{formatPrice(finalPrice)}</span>
                        )}
                    </div>


                </div>
            </div>
        );
    };

    return (
        <section className="new-arrivals-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">New Arrivals</h2>

                </div>

                {loading ? (
                    <div className="products-grid">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="product-card-skeleton">
                                <div className="skeleton-image"></div>
                                <div className="skeleton-details">
                                    <div className="skeleton-title"></div>
                                    <div className="skeleton-rating"></div>
                                    <div className="skeleton-price"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <i className="fas fa-exclamation-circle"></i>
                        <h3>Something went wrong</h3>
                        <p>{error}</p>
                        <button className="retry-btn" onClick={loadProducts}>
                            Try Again
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-search"></i>
                        <h3>No products found</h3>
                        <p>We couldn't find any trending products at the moment.</p>
                        <button className="browse-btn" onClick={() => navigate('/products')}>
                            Browse All Products
                        </button>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
        .new-arrivals-section {
          padding: 60px 0;
          background: #f8fafc;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 15px;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .section-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 10px;
        }
        
        .section-subtitle {
          font-size: 16px;
          color: #718096;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 25px;
        }
        
        /* Product Card Styles */
        .product-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .product-image-container {
          position: relative;
          height: 280px;
          overflow: hidden;
          background: #f9fafb;
        }
        
        .product-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.4s ease;
        }
        
        .product-hover-image {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }
        
        .product-hover-image.active {
          opacity: 1;
        }
        
        .image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        
        .discount-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #ff3e6c;
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          z-index: 2;
        }
        
        .quick-view-btn {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.95);
          border: none;
          padding: 10px 20px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #4a5568;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 2;
        }
        
        .product-card:hover .quick-view-btn {
          bottom: 15px;
        }
        
        .quick-view-btn:hover {
          background: #4a5568;
          color: white;
        }
        
        .product-info {
          padding: 20px;
        }
        
        .product-title {
          font-weight: 600;
          font-size: 16px;
          color: #2d3748;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 48px;
          line-height: 1.4;
        }
        
        .rating {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .rating i {
          font-size: 12px;
          margin-right: 2px;
          color: #e2e8f0;
        }
        
        .rating i.filled {
          color: #f59e0b;
        }
        
        .rating-count {
          font-size: 12px;
          color: #718096;
          margin-left: 6px;
        }
        
        .price-container {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }
        
        .original-price {
          text-decoration: line-through;
          color: #a0aec0;
          font-size: 14px;
        }
        
        .current-price {
          color: #1a202c;
          font-weight: 700;
          font-size: 18px;
        }
        
        .add-to-cart-btn {
          width: 100%;
          background: #ff3e6c;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .add-to-cart-btn:hover {
          background: #e62e5c;
        }
        
        /* Skeleton loading */
        .product-card-skeleton {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
        }
        
        .skeleton-image {
          height: 250px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        
        .skeleton-details {
          padding: 20px;
        }
        
        .skeleton-title {
          height: 16px;
          width: 80%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 12px;
        }
        
        .skeleton-rating {
          height: 14px;
          width: 60%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 12px;
        }
        
        .skeleton-price {
          height: 18px;
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
        .empty-state, .error-state {
          text-align: center;
          padding: 60px 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
          max-width: 500px;
          margin: 0 auto;
        }
        
        .empty-state i, .error-state i {
          font-size: 64px;
          margin-bottom: 20px;
          color: #cbd5e0;
        }
        
        .error-state i {
          color: #fc8181;
        }
        
        .empty-state h3, .error-state h3 {
          font-size: 20px;
          color: #2d3748;
          margin-bottom: 10px;
        }
        
        .empty-state p, .error-state p {
          color: #718096;
          margin-bottom: 25px;
        }
        
        .browse-btn, .retry-btn {
          background: #ff3e6c;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .browse-btn:hover, .retry-btn:hover {
          background: #e62e5c;
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }
        }
        
        @media (max-width: 768px) {
          .new-arrivals-section {
            padding: 40px 0;
          }
          
          .section-title {
            font-size: 26px;
          }
          
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 15px;
          }
          
          .product-image-container {
            height: 250px;
          }
          
          .product-info {
            padding: 15px;
          }
          
          .product-title {
            font-size: 14px;
          }
          
          .current-price {
            font-size: 16px;
          }
        }
        
        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .section-title {
            font-size: 24px;
          }
        }
      `}</style>
        </section>
    );
};

export default NewArrivals;