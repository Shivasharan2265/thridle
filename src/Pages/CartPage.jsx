import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import './CartPage.css'; // Make sure to include the CSS I'll provide below
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    CartDetails();
  }, []);

  const CartDetails = async () => {
    const fd = new FormData();
    fd.append('authToken', localStorage.getItem('authToken'));
    fd.append('programType', 'getCartDetails');

    try {
      const response = await api.post('/ecom/order', fd);
      console.log(response);

      // Check if unauthorized
      if (
        response.data?.data === "Unauthorized user" &&
        response.data?.success === false
      ) {
        localStorage.removeItem('authToken'); // clear token
        navigate('/login'); // redirect to login page
        return;
      }

      const items = response.data?.data || [];
      setCartItems(items);
      setCartCount(items.length);
    } catch (error) {
      console.error('Cart Error:', error);
    } finally {
      setIsLoading(false);
    }
  };


let subtotal = 0;
let taxTotal = 0;
let grandTotal = 0;

// Shipping total (from backend shipping_cost if present)
let shippingTotal = cartItems.reduce(
  (sum, item) => sum + parseFloat(item.shipping_cost || 0),
  0
);

cartItems.forEach((item) => {
  const price = parseFloat(item.price || 0) * parseInt(item.quantity || 1);
  const taxPercent = parseFloat(item.tax || 0);
  const model = (item.tax_model || "").trim().toLowerCase();

  if (model === "include") {
    // Tax already in price → extract it from subtotal
    const taxPortion = (price * taxPercent) / (100 + taxPercent);
    subtotal += price - taxPortion;
    taxTotal += taxPortion;
    grandTotal += price; // price already includes tax
  } else {
    // Tax excluded → add it on top
    const taxAmount = (taxPercent / 100) * price;
    subtotal += price;
    taxTotal += taxAmount;
    grandTotal += price + taxAmount;
  }
});

// Add shipping after tax logic
grandTotal += shippingTotal;

  const removeProduct = async (cartId) => {
    const fd = new FormData();
    fd.append('authToken', localStorage.getItem('authToken'));
    fd.append('programType', 'removeProductFromCart');
    fd.append('cartId', cartId);

    try {
      await api.post('/ecom/order', fd);
      setCartItems((prev) => prev.filter((item) => item.id !== cartId));
      setCartCount((prev) => prev - 1);
    } catch (error) {
      console.error('Remove Error:', error);
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    const fd = new FormData();
    fd.append('authToken', localStorage.getItem('authToken'));
    fd.append('programType', 'updateCartQuantity');
    fd.append('cartId', cartId);
    fd.append('quantity', newQuantity);

    try {
      await api.post('/ecom/order', fd);
      setCartItems(prev =>
        prev.map(item =>
          item.id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Update Quantity Error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Breadcrumb */}
      <div className="wishlist-header">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Cart </span>
          </nav>
        </div>
      </div>
      {/* Main Cart Content */}
      <section className="cart-content">
        <div className="container">
          {cartCount === 0 ? (
            <div className="empty-cart">

              <div className="empty-cart-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="10" cy="20.5" r="1" /><circle cx="18" cy="20.5" r="1" /><path d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1" />
                </svg>
              </div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added anything to your cart yet</p>
              <a href="/" className="btn btn-primary">Continue Shopping</a>
            </div>
          ) : (
            <div className="cart-grid">
              {/* Cart Items Section */}
              <div className="cart-items-section">
                <div className="cart-header">
                  <h2>Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h2>
                  <a href="/" className="continue-shopping">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Continue Shopping
                  </a>
                </div>

                <div className="cart-items-list">
                  {cartItems.map((item) => {
                    const { id, name, thumbnail, quantity, price, color, variations, product_id } = item;
                    const imageUrl = `https://thridle.com/ecom/storage/app/public/product/thumbnail/${thumbnail}`;
                    const variationObj = JSON.parse(item.variations || '{}');

                    return (
                      <div className="cart-item" key={id}>
                        <div className="item-image">
                          <a href={`/product/${product_id}`}>
                            <img src={imageUrl} alt={name} />
                          </a>
                        </div>

                        <div className="item-details">
                          <div className="item-info">
                            <h3><a href={`/product/${product_id}`}>{name}</a></h3>
                            {variationObj?.Size && (
                              <div className="item-variant">
                                <span>Size:</span> {variationObj.Size}
                              </div>
                            )}
                            {color && (
                              <div className="item-variant">
                                <span>Color:</span> {color}
                              </div>
                            )}
                          </div>

                          <div className="item-quantity readonly">
                            <span>Qty: {quantity}</span>
                          </div>

                        </div>

                        <div className="item-price">
                          <div>₹{(price * quantity).toFixed(2)}</div>
                          <button
                            className="remove-item"
                            onClick={() => removeProduct(id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary Section */}
              <div className="order-summary">
                <div className="summary-card">
                  <h2>Order Summary</h2>

                  <div className="summary-row">
  <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
  <span>₹{subtotal.toFixed(2)}</span>
</div>

<div className="summary-row">
  <span>Shipping</span>
  <span>{shippingTotal === 0 ? 'FREE' : `₹${shippingTotal.toFixed(2)}`}</span>
</div>

<div className="summary-row">
  <span>Tax</span>
  <span>₹{taxTotal.toFixed(2)}</span>
</div>

<div className="summary-row total">
  <span>Total</span>
  <span>₹{grandTotal.toFixed(2)}</span>
</div>




                  <button className="checkout-btn" onClick={() => navigate("/check-out")}>Proceed to Checkout</button>

                  <div className="payment-methods">
                    <p>We accept:</p>
                    <div className="payment-icons">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" height="24" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" height="24" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" height="24" />

                    </div>
                  </div>
                </div>

                <div className="reassurance">
                  <div className="reassurance-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"></path>
                    </svg>
                    <div>
                      <h4>Secure Payment</h4>
                      <p>Your information is protected</p>
                    </div>
                  </div>

                  <div className="reassurance-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <div>
                      <h4>Fast Delivery</h4>
                      <p>Get your order quickly</p>
                    </div>
                  </div>

                  <div className="reassurance-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                    </svg>
                    <div>
                      <h4>Easy Returns</h4>
                      <p>30-day return policy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CartPage;