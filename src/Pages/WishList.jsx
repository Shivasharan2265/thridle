import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './WishList.css';

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

const WishList = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "getWishlistDetails");

    try {
      const response = await api.post("/ecom/wishlist", fd);
      if (response.data?.success) {
        setWishlistItems(response.data.data || []);
      }
    } catch (error) {
      console.error("Wishlist API Error:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (productId) => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "removeFromWishlist");
    fd.append("wishlistId", productId);

    try {
      const response = await api.post("/ecom/wishlist", fd);
      if (response.data?.success) {
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
       
        toast.success("Removed from wishlist");
setWishlistItems([])
         fetchList();
      }
    } catch (error) {
      console.error("Wishlist API Error:", error);
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="wishlist-page">
      {/* Page Header */}
      <div className="wishlist-header">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Wishlist</span>
          </nav>
        </div>
      </div>

      {/* Wishlist Content */}
      <div className="container">
        {loading ? (
          <div className="wishlist-loading">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="wishlist-item-skeleton">
                <div className="image-placeholder"></div>
                <div className="details-placeholder">
                  <div className="line"></div>
                  <div className="line short"></div>
                  <div className="button-placeholder"></div>
                </div>
                <div className="remove-placeholder"></div>
              </div>
            ))}
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="wishlist-grid">
            {wishlistItems.map((item) => {
              const imageUrl = item.thumbnail
                ? `https://thridle.com/ecom/storage/app/public/product/thumbnail/${item.thumbnail}`
                : "https://via.placeholder.com/300";
              const inStock = parseInt(item.current_stock || 0) > 0;

              // Calculate discounted price
              const discountedPrice = calculateDiscountedPrice(
                item.unit_price,
                item.discount,
                item.discount_type
              );

              const hasDiscount = discountedPrice < item.unit_price;

              return (
                <div key={item.id} className="wishlist-item">
                  <div className="wishlist-item-image">
                    <img 
                      src={imageUrl} 
                      alt={item.name} 
                      onClick={() => navigate(`/product/${item.id}`)}
                    />
                    <button 
                      className="remove-btn p-0"
                      onClick={() => removeProduct(item.wishlistId)}
                      aria-label="Remove item"
                    >
                      x
                    </button>
                  </div>
                  <div className="wishlist-item-details">
                    <h3 onClick={() => navigate(`/product/${item.id}`)}>
                      {item.name}
                    </h3>

                    <div className="price">
                      {hasDiscount ? (
                        <>
                          <span  className="discounted"
                                  style={{
                                    textDecoration: "line-through",
                                    color: "#ddd",
                                   
                                  }}
                                >₹{item.unit_price}</span>
                          <span className="discounted " style={{marginLeft:"5px"}}>₹{discountedPrice}</span>{" "}
                         
                        </>
                      ) : (
                        <span>₹{item.unit_price}</span>
                      )}
                    </div>

                    <div className={`stock-status ${inStock ? 'in-stock' : 'out-of-stock'}`}>
                      {inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                    <button
                      className={`action-btn ${inStock ? '' : 'disabled'}`}
                      onClick={() => inStock && navigate(`/product/${item.id}`)}
                      disabled={!inStock}
                    >
                      {inStock ? 'View Product' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-wishlist">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" fill="#EB4D7F" fillOpacity="0.2" stroke="#EB4D7F" strokeWidth="2"/>
            </svg>
            <h3>Your wishlist is empty</h3>
            <p>Start adding items you love</p>
            <button onClick={() => navigate('/')} className="shop-btn">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;
