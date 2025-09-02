import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()


  useEffect(() => {
    fetchHistory();
  }, []);

const fetchHistory = async () => {
  const fd = new FormData();
  fd.append("authToken", localStorage.getItem("authToken") || "Guest");
  fd.append("programType", "orderHistory");

  try {
    const response = await api.post("/ecom/order", fd);
    const fetchedOrders = response.data?.data?.orders || [];
    setOrders(fetchedOrders);
  } catch (error) {
    console.error("Order API Error:", error);
  } finally {
    setLoading(false); // important
  }
};

  const parseProduct = (productStr) => {
    try {
      return JSON.parse(productStr);
    } catch {
      return {};
    }
  };

return (
  <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
    <h2 style={{ marginBottom: "20px" }}>My Orders</h2>

    {loading ? (
      // Skeleton Loader UI
      Array.from({ length: 2 }).map((_, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ddd",
            padding: "16px",
            marginBottom: "20px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            animation: "pulse 1.5s infinite ease-in-out",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ width: "120px", height: "14px", background: "#eee", borderRadius: "4px" }}></div>
            <div style={{ width: "80px", height: "14px", background: "#eee", borderRadius: "4px" }}></div>
            <div style={{ width: "100px", height: "14px", background: "#eee", borderRadius: "4px" }}></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "80px", height: "80px", background: "#eee", borderRadius: "6px" }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ width: "70%", height: "14px", background: "#eee", borderRadius: "4px", marginBottom: "8px" }}></div>
              <div style={{ width: "50%", height: "12px", background: "#eee", borderRadius: "4px" }}></div>
            </div>
          </div>
        </div>
      ))
    ) : orders.length === 0 ? (
      <div className="empty-cart">
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M7 4H3M7 4H21L19 13H8L7 4ZM7 4L8 13M10 20C10 20.5523 9.55228 21 9 21C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19C9.55228 19 10 19.4477 10 20ZM18 20C18 20.5523 17.5523 21 17 21C16.4477 21 16 20.5523 16 20C16 19.4477 16.4477 19 17 19C17.5523 19 18 19.4477 18 20Z"
      stroke="#EB4D7F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fillOpacity="0.1"
    />
  </svg>

  <h3>Your cart is empty</h3>
  <p>Looks like you haven’t added anything yet</p>
  <button onClick={() => navigate('/')} className="shop-btn">
    Continue Shopping
  </button>
</div>

    ) : (
      // Real data rendering
      orders.map((orderItem, index) => {
        const order = orderItem.order;
        const orderDetails = orderItem.order_details;
        return (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "16px",
              marginBottom: "20px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
              <div><strong>Order ID:</strong> #{order.id}</div>
              <div><strong>Status:</strong> {order.order_status}</div>
              <div><strong>Date:</strong> {order.created_at.split(" ")[0]}</div>
            </div>

            <div>
              {orderDetails.map((detail, i) => {
                const product = parseProduct(detail.product_details);
                const image = product?.thumbnail
                  ? `https://thridle.com/ecom/storage/app/public/product/thumbnail/${product.thumbnail}`
                  : "";

                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderTop: i > 0 ? "1px solid #eee" : "none",
                      paddingTop: "12px",
                      marginTop: i > 0 ? "12px" : "0",
                    }}
                  >
                    {image && (
                      <img
                        src={image}
                        alt={product.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          marginRight: "16px",
                          border: "1px solid #f0f0f0",
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600" }}>{product.name || "Product Name"}</div>
                      <div style={{ fontSize: "14px", color: "#555" }}>
                        Qty: {detail.qty} | ₹{detail.price}
                      </div>
                      {(() => {
                        try {
                          const variation = JSON.parse(detail.variation);
                          return (
                            <div style={{ fontSize: "13px", color: "#777" }}>
                              {Object.entries(variation)
                                .map(([key, val]) => `${key}: ${val}`)
                                .join(" | ")}
                            </div>
                          );
                        } catch (e) {
                          return null;
                        }
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                borderTop: "1px solid #eee",
                marginTop: "16px",
                paddingTop: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>Total: ₹{order.order_amount}</strong>
              <span
                style={{
                  color: order.payment_status === "paid" ? "green" : "red",
                  fontWeight: "500",
                }}
              >
                {order.payment_status === "paid" ? "Paid" : "Payment Pending"}
              </span>
            </div>
          </div>
        );
      })
    )}
  </div>
);

};

export default OrderHistory;
