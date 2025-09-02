import React, { useEffect, useRef, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import "./CheckOut.css"
import { Link, useNavigate } from "react-router-dom";

const CheckOut = () => {
  const nameInputRef = useRef(null); // Ref for first field
  const navigate = useNavigate()
  const [addressListData, setAddressListData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("COD");



  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [profile, setProfile] = useState({
    f_name: "",
    l_name: "",
    email: "",
    phone: "",
  });
  const [addressData, setAddressData] = useState({
    contact_person_name: "",
    email: "",
    address_type: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
    state: "",
    country: "",
    isPrimary: "no",
  });

  const CartDetails = async () => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "getCartDetails");

    try {
      const response = await api.post("/ecom/order", fd);
      const cartData = response?.data?.data || [];
      console.log("Cart checkout Response:", cartData);
      setCartItems(cartData);
    } catch (error) {
      console.error("Cart Error:", error);
    }
  };
  const addAddress = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "addShippingAddress");
    fd.append("contact_person_name", addressData.contact_person_name);
    fd.append("email", addressData.email);
    fd.append("address_type", addressData.address_type || "Home");
    fd.append("address", addressData.address);
    fd.append("city", addressData.city);
    fd.append("zip", addressData.zip);
    fd.append("phone", addressData.phone);
    fd.append("state", addressData.state);
    fd.append("country", addressData.country || "India");

    try {
      const response = await api.post("/users/user", fd);
      console.log("Add Address", response);

      if (response.data.success) {
        toast.success(response.data.message);

        // If marked as primary, update default
        if (addressData.isPrimary === "yes") {
          const newId = response?.data?.insertId;
          setSelectedAddressId(newId);
          await defaultAddress(newId); // Assuming you have this function
        }

        await addressList(); // Refresh address list
        setShowForm(false);

        // Reset form
        setAddressData({
          contact_person_name: "",
          email: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          phone: "",
          country: "India",
          isPrimary: "no",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Add Address Error:", error);
      toast.error("Failed to add address.");
    }
  };
  const handleDeleteConfirmed = async () => {
    if (!addressToDelete) return;

    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "deleteShippingAddress");
    fd.append("id", addressToDelete);

    try {
      const response = await api.post("/users/user", fd);
      console.log("Delete Address:", response);
      // Refresh address list
      addressList();
      setShowDeleteModal(false);
      setAddressToDelete(null);
    } catch (error) {
      console.error("Delete Address Error:", error);
    }
  };
  const profileDetails = async () => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "getUserProfileDetails");

    try {
      const response = await api.post("/users/user", fd);
      console.log("profile", response);
      const user = response?.data?.data?.[0];
      if (user) {
        setProfile({
          f_name: user.f_name || "",
          l_name: user.l_name || "",
          email: user.email || "",
          phone: user.phone || "", // Optional
        });
      }
    } catch (error) {
      console.error("Profile Error:", error);
    }
  };
  const addressList = async () => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "getShippingAddressDetails");

    try {
      const response = await api.post("/users/user", fd);
      console.log("Address List:", response);
      setAddressListData(response?.data?.data || []);
    } catch (error) {
      console.error("Address List Error:", error);
    }
  };
  useEffect(() => {
    CartDetails();
    profileDetails();
    addressList();

    checkOut()
  }, []);


  const checkOut = async () => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "createdOrderIdForPayment");
    fd.append("shippingAddress", 1);


    try {
      const response = await api.post("/ecom/payment", fd);
      console.log("Addffffffress List:", response);

    } catch (error) {
      console.error("Address List Error:", error);
    }
  };




  let subtotal = 0;
  let taxTotal = 0;
  let total = 0;

  let shippingTotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.shipping_cost || 0),
    0
  );

  cartItems.forEach((item) => {
    const price = parseFloat(item.price || 0); // already total for that line
    const taxPercent = parseFloat(item.tax || 0);
    const model = (item.tax_model || "").toLowerCase();

    if (model === "include") {
      // tax is already in price, so remove it from subtotal
      const taxPortion = (price * taxPercent) / (100 + taxPercent);
      subtotal += price - taxPortion;
      taxTotal += taxPortion;
      total += price; // already contains tax
    } else {
      // tax not included, so add it
      const taxAmount = (taxPercent / 100) * price;
      subtotal += price;
      taxTotal += taxAmount;
      total += price + taxAmount;
    }
  });

  // Add shipping at the end
  total += shippingTotal;

  console.log({ subtotal, taxTotal, shippingTotal, total });


  const placeOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address.");
      return;
    }

    const authToken = localStorage.getItem("authToken") || "Guest";

    if (paymentMethod === "COD") {
      // Existing COD flow
      const fd = new FormData();
      fd.append("authToken", authToken);
      fd.append("programType", "submitOrder");
      fd.append("shippingAddress", selectedAddressId);

      try {
        const response = await api.post("/ecom/order", fd);
        if (response.data?.success) {
          toast.success(response.data.message);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Order Error:", error);
        toast.error("Something went wrong. Try again.");
      }
    } else if (paymentMethod === "ONLINE") {
      try {
        // Step 1: Create order ID for Razorpay
        const fd = new FormData();
        fd.append("authToken", authToken);
        fd.append("programType", "createdOrderIdForPayment");
        fd.append("shippingAddress", selectedAddressId);

        const response = await api.post("/ecom/payment", fd);

        if (response.data.res !== "success") {
          toast.error("Payment initiation failed.");
          return;
        }

        const data = response.data;

        const options = {
          key: data.razorpay_key,
          amount: data.amount * 100, // paise
          currency: "INR",
          name: "Thridle",
          description: data.description,
          order_id: data.rpay_order_id,
          prefill: {
            name: data.customer_name,
            email: data.customer_email,
            contact: data.customer_mobile,
          },
          handler: async function (paymentResult) {
            console.log("✅ Payment Success:", paymentResult);

            // Step 2: Hit API for success payment
            const fdSuccess = new FormData();
            fdSuccess.append("authToken", authToken);
            fdSuccess.append("programType", "successPayment");
            fdSuccess.append("shippingAddress", selectedAddressId);
            fdSuccess.append("order_number", data.order_number);
            fdSuccess.append("razorpay_payment_id", paymentResult.razorpay_payment_id);
            fdSuccess.append("razorpay_signature", paymentResult.razorpay_signature);


            for (let pair of fdSuccess.entries()) {
              console.log(pair[0], pair[1]); // Logs each key-value pair
            }

            try {
              const res = await api.post("/ecom/payment", fdSuccess);

              console.log("payyyy", res)
              toast.success("Payment successful!");

            } catch (err) {
              console.error("Error reporting success payment:", err);
              toast.error("Payment succeeded but reporting failed.");
            }
          },
          modal: {
            ondismiss: async function () {
              console.log("⚠️ Payment modal dismissed");

              const fdFailed = new FormData();
              fdFailed.append("authToken", authToken);
              fdFailed.append("programType", "paymentFailed");
              fdFailed.append("shippingAddress", selectedAddressId);
              fdFailed.append("order_number", data.order_number);
              fdFailed.append("response", "Cancelled Payment");
              fdFailed.append("paymentId", "NA");



              for (let pair of fdFailed.entries()) {
                console.log(pair[0], pair[1]); // Logs each key-value pair
              }

              try {
                const res = await api.post("/ecom/payment", fdFailed);
                console.log("failll", res)
                toast.error("Payment cancelled.");

              } catch (err) {
                console.error("Error reporting cancelled payment:", err);
              }
            },
          },
          theme: { color: "#3399cc" },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", async function (failure) {
          console.log("❌ Payment Failed:", failure);

          const fdFailed = new FormData();
          fdFailed.append("authToken", authToken);
          fdFailed.append("programType", "paymentFailed");
          fdFailed.append("shippingAddress", selectedAddressId);
          fdFailed.append("order_number", data.order_number);
          fdFailed.append("response", failure.error.description || "Payment failed");
          fdFailed.append("razorpayPaymentId", failure.error.metadata.payment_id || "");

          for (let pair of fd.entries()) {
            console.log(pair[0], pair[1]); // Logs each key-value pair
          }

          try {
            await api.post("/ecom/order", fdFailed);
            toast.error("Payment failed.");
            navigate("/");
          } catch (err) {
            console.error("Error reporting failed payment:", err);
          }
        });

        rzp.open();
      } catch (error) {
        console.error("Payment Error:", error);
        toast.error("Something went wrong during payment.");
      }
    }
  };




  return (
    <div>
      <div
        id="mobile_top_menu_wrapper"
        class="hidden-lg-up"
        style={{ display: "none" }}
      >
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
            <span>Checkout</span>
          </nav>
        </div>
      </div>

      <section id="wrapper" class="top-wrapper" style={{ marginTop: "20px" }}>
        <div class="container">
          <section id="content">
            <div class="row">
              <div class="col-lg-8 col-sm-12">
                <div class="accordion" id="accordionExample">
                  <section
                    style={{ marginBottom: "10px" }}
                    className="checkout-step card"
                    id="checkout-personal-information-step"
                  >
                    <div
                      data-toggle="collapse"
                      data-target="#collapseone"
                      aria-expanded="true"
                      aria-controls="collapseone"
                    >
                      <h1 className="step-title h3">
                        <span className="step-number">1</span> Personal
                        Information
                      </h1>
                    </div>
                    <div
                      className="content collapse show"
                      id="collapseone"
                      data-parent="#accordionExample"
                    >
                      <div className="card shadow-sm p-4 mt-3">
                        <div className="d-flex align-items-center mb-3">
                          {/* <img
                            src={`http://yourdomain.com/${profile.image}`} // adjust base URL if needed
                            alt="User"
                            className="rounded-circle"
                            width="80"
                            height="80"
                          /> */}
                          <div className="ms-3">
                            <h4 className="mb-0">
                              {profile.f_name} {profile.l_name}
                            </h4>
                            <small className="text-muted">
                              {profile.email}
                            </small>
                          </div>
                        </div>
                        <hr />
                        <p className="mb-1">
                          <strong>Phone:</strong> {profile.phone}
                        </p>
                        <p className="mb-1">
                          <strong>Country:</strong> {profile.country || "N/A"}
                        </p>
                        <p className="mb-1">
                          <strong>City:</strong> {profile.city || "N/A"}
                        </p>
                        <p className="mb-1">
                          <strong>Zip:</strong> {profile.zip || "N/A"}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section
                    style={{ marginBottom: "10px" }}
                    class="checkout-step card"
                    id="checkout-addresses-step"
                  >
                    <div
                      class="collapsed"
                      data-toggle="collapse"
                      data-target="#collapsetwo"
                      aria-expanded="false"
                      aria-controls="collapsetwo"
                    >
                      <h1 class="step-title h3">
                        <span class="step-number">2</span> Addresses
                      </h1>
                    </div>
                    <div
                      class="content collapse"
                      id="collapsetwo"
                      data-parent="#accordionExample"
                    >
                      <div className="row">
                        {addressListData.map((item) => {
                          const isSelected = selectedAddressId === item.id;

                          return (
                            <div className="col-md-6 mb-4" key={item.id}>
                              <div
                                className={`card address-card shadow-sm ${isSelected ? "border-primary bg-light-blue" : "border-light"
                                  }`}
                                style={{
                                  border: isSelected ? "2px solid #48B7FF" : "1px solid #ddd",
                                  borderRadius: "10px",
                                  transition: "0.3s ease",
                                  cursor: "pointer",
                                  backgroundColor: isSelected ? "#f0f9ff" : "white"
                                }}
                                onClick={() => setSelectedAddressId(item.id)}
                              >
                                <div className="card-body">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="mb-0 text-capitalize">{item.contact_person_name}</h5>
                                    {item.isDefault === 1 && (
                                      <span className="badge bg-primary">Default</span>
                                    )}
                                  </div>

                                  <p className="mb-2 text-muted" style={{ fontSize: "0.9rem" }}>
                                    {item.address}, {item.city}, {item.state}, {item.zip}, {item.country}
                                  </p>

                                  <ul className="list-unstyled mb-0" style={{ fontSize: "0.92rem" }}>
                                    <li>
                                      <strong>Type:</strong> {item.address_type}
                                    </li>
                                    <li>
                                      <strong>Email:</strong> {item.email}
                                    </li>
                                    <li>
                                      <strong>Phone:</strong> {item.phone}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>


                      <div className="text-right mb-3">
                        <button
                          className="btn btn-outline-primary"

                          onClick={async () => {
                            try {
                              // Optional backend call if needed
                              setShowForm(true);
                              setSelectedAddressId(null);
                              setAddressData({
                                contact_person_name: "",
                                email: "",
                                address: "",
                                city: "",
                                state: "",
                                zip: "",
                                phone: "",
                                country: "India",
                                isPrimary: "no",
                              });

                              setTimeout(() => {
                                if (nameInputRef.current) {
                                  nameInputRef.current.focus(); // Auto-focus first field
                                }
                              }, 100);
                            } catch (error) {
                              console.error("Prepare form error:", error);
                            }
                          }}
                        >
                          + Add Address
                        </button>
                        {showForm && (
                          <form
                            onSubmit={addAddress}
                            className="js-address-form mt-4"
                          >
                            {" "}
                            <div className="d-flex justify-content-end">
                              <button
                                type="button"
                                className="btn"
                                onClick={() => setShowForm(false)}
                                style={{
                                  backgroundColor: "#ec87a7", // or any shade of pink you prefer
                                  color: "white",
                                  fontSize: "24px",
                                  fontWeight: "bold",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "40px",
                                  height: "40px",
                                  lineHeight: "24px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                                aria-label="Close"
                              >
                                &times;
                              </button>
                            </div>
                            <section>
                              {/* Contact Person Name */}
                              <div className="form-group row">
                                <label className="col-md-3 col-sm-12 form-control-label required">
                                  Full Name
                                </label>
                                <div className="col-md-6 col-sm-12">
                                  <input
                                    ref={nameInputRef} // Auto-focus target
                                    className="form-control stylish-input"
                                    name="contact_person_name"
                                    type="text"
                                    value={addressData.contact_person_name}
                                    onChange={(e) =>
                                      setAddressData({ ...addressData, contact_person_name: e.target.value })
                                    }
                                    required
                                  />

                                </div>
                              </div>

                              {/* Email */}
                              <div className="form-group row">
                                <label className="col-md-3 col-sm-12 form-control-label required">
                                  Email
                                </label>
                                <div className="col-md-6 col-sm-12">
                                  <input
                                    className="form-control"
                                    name="email"
                                    type="email"
                                    value={addressData.email}
                                    onChange={(e) =>
                                      setAddressData({
                                        ...addressData,
                                        email: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                              </div>

                              {/* Address */}
                              <div className="form-group row">
                                <label className="col-md-3 col-sm-12 form-control-label required">
                                  Address
                                </label>
                                <div className="col-md-6 col-sm-12">
                                  <input
                                    className="form-control"
                                    name="address"
                                    type="text"
                                    value={addressData.address}
                                    onChange={(e) =>
                                      setAddressData({
                                        ...addressData,
                                        address: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                              </div>

                              {/* City */}
                              <div className="form-group row">
                                <label className="col-md-3 col-sm-12 form-control-label required">
                                  City
                                </label>
                                <div className="col-md-6 col-sm-12">
                                  <input
                                    className="form-control"
                                    name="city"
                                    type="text"
                                    value={addressData.city}
                                    onChange={(e) =>
                                      setAddressData({
                                        ...addressData,
                                        city: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                              </div>

                              {/* State */}
                              <div className="form-group row">
                                <label className="col-md-3 col-sm-12 form-control-label required">
                                  State
                                </label>
                                <div className="col-md-6 col-sm-12">
                                  <input
                                    className="form-control"
                                    name="state"
                                    type="text"
                                    value={addressData.state}
                                    onChange={(e) =>
                                      setAddressData({
                                        ...addressData,
                                        state: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                              </div>

                              {/* Zip */}
                              <div className="form-group row">
                                <label className="col-md-3 col-sm-12 form-control-label required">
                                  Zip Code
                                </label>
                                <div className="col-md-6 col-sm-12">
                                  <input
                                    className="form-control"
                                    name="zip"
                                    type="text"
                                    value={addressData.zip}
                                    onChange={(e) =>
                                      setAddressData({
                                        ...addressData,
                                        zip: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                              </div>

                              {/* Phone */}
                              <div className="form-group row">
                                <label className="col-md-3 col-sm-12 form-control-label required">
                                  Phone
                                </label>
                                <div className="col-md-6 col-sm-12">
                                  <input
                                    className="form-control"
                                    name="phone"
                                    type="text"
                                    value={addressData.phone}
                                    onChange={(e) =>
                                      setAddressData({
                                        ...addressData,
                                        phone: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                              </div>

                              {/* Primary Address */}
                              {/* <div className="form-group row">
        <label className="col-md-3 col-sm-12 form-control-label">
          Primary Address
        </label>
        <div className="col-md-6 col-sm-12 d-flex align-items-center">
          <div className="form-check mr-3">
            <input
              className="form-check-input"
              type="radio"
              name="isPrimary"
              value="yes"
              checked={addressData.isPrimary === "yes"}
              onChange={() =>
                setAddressData({ ...addressData, isPrimary: "yes" })
              }
            />
            <label className="form-check-label">Yes</label>
          </div>
          <div className="form-check ml-3">
            <input
              className="form-check-input"
              type="radio"
              name="isPrimary"
              value="no"
              checked={addressData.isPrimary === "no"}
              onChange={() =>
                setAddressData({ ...addressData, isPrimary: "no" })
              }
            />
            <label className="form-check-label">No</label>
          </div>
        </div>
      </div> */}
                            </section>
                            <footer className="form-footer clearfix">
                              <button
                                type="submit"
                                className="continue btn btn-primary float-xs-right"
                              >
                                Add Address
                              </button>
                            </footer>
                          </form>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* <section
                    style={{ marginBottom: "10px" }}
                    class="checkout-step card"
                    id="checkout-delivery-step"
                  >
                    <div
                      class="collapsed"
                      data-toggle="collapse"
                      data-target="#collapsethree"
                      aria-expanded="false"
                      aria-controls="collapsethree"
                    >
                      <h1 class="step-title h3">
                        <span class="step-number">3</span> Shipping Method
                      </h1>
                    </div>
                    <div
                      class="content collapse"
                      id="collapsethree"
                      data-parent="#accordionExample"
                    >
                      <form class="clearfix" method="post">
                        <div id="delivery">
                          <label class="delivery_message">
                            If you would like to add a comment about your order,
                            please write it in the field below.
                          </label>
                          <textarea
                            rows="2"
                            cols="120"
                            id="delivery_message"
                            class="form-control"
                            name="delivery_message"
                          ></textarea>
                        </div>
                        <button
                          type="submit"
                          class="continue btn btn-primary float-xs-right"
                          value="1"
                        >
                          Continue
                        </button>
                      </form>
                    </div>
                  </section> */}
                  <section
                    style={{ marginBottom: "10px" }}
                    class="checkout-step card"
                    id="checkout-payment-step"
                  >
                    <div
                      class="collapsed"
                      data-toggle="collapse"
                      data-target="#collapsefour"
                      aria-expanded="false"
                      aria-controls="collapsefour"
                    >
                      <h1 class="step-title h3">
                        <span class="step-number">3</span> Payment
                      </h1>
                    </div>
                    <div
                      class="content collapse"
                      id="collapsefour"
                      data-parent="#accordionExample"
                    >
                      <div className="payment-option">
                        <div
                          className={`payment-card ${paymentMethod === "COD" ? "active" : ""}`}
                          onClick={() => setPaymentMethod("COD")}
                        >
                          <input
                            type="radio"
                            id="cod"
                            name="payment-option"
                            checked={paymentMethod === "COD"}
                            onChange={() => setPaymentMethod("COD")}
                          />
                          <label htmlFor="cod" className="mb-0">💵 Cash on Delivery</label>
                        </div>

                        <div
                          className={`payment-card ${paymentMethod === "ONLINE" ? "active" : ""}`}
                          onClick={() => setPaymentMethod("ONLINE")}
                        >
                          <input
                            type="radio"
                            id="online"
                            name="payment-option"
                            checked={paymentMethod === "ONLINE"}
                            onChange={() => setPaymentMethod("ONLINE")}
                          />
                          <label htmlFor="online " className="mb-0">💳 Online / Net Banking</label>
                        </div>
                      </div>

                      <form method="GET" class="payment-form mt-6">
                        <ul>
                          <li style={{ display: "flex" }}>
                            <span class="custom-checkbox">
                              <input required="" value="1" type="checkbox" />
                              <span>
                                <i class="material-icons checkbox-checked"></i>
                              </span>
                            </span>
                            <label>
                              {" "}
                              I agree to the <a href="#">
                                terms of service
                              </a>{" "}
                              and will adhere to them unconditionally.
                            </label>
                          </li>
                        </ul>
                      </form>

                    </div>
                  </section>
                  <button
                    onClick={placeOrder}
                    className="btn btn-primary center-block mt-3 mb-3"
                  >
                    Place Order
                  </button>
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <section id="js-checkout-summary" className="checkout-summary">
                  <div className="summary-header">
                    <h3>Order Summary</h3>
                    <span className="items-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
                  </div>

                  <div className="product-list">
                    {cartItems.map((item, index) => (
                      <div className="product-item" key={index}>
                        <div className="product-image">
                          <img
                            src={`https://thridle.com/ecom/storage/app/public/product/thumbnail/${item.thumbnail}`}
                            alt={item.name}
                            loading="lazy"
                          />
                        </div>
                        <div className="product-details">
                          <h4 className="product-name">{item.name}</h4>
                          <div className="product-meta">
                            <span className="quantity">Qty: {item.quantity}</span>
                            <span className="price">₹{item.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="price-breakdown">
                    <div className="price-row">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="price-row">
                      <span>Taxes</span>
                      <span>₹{taxTotal.toFixed(2)}</span>
                    </div>
                    <div className="price-row">
                      <span>Shipping</span>
                      <span>₹{shippingTotal.toFixed(2)}</span>
                    </div>

                    <div className="divider"></div>

                    <div className="price-row total">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <style jsx>{`
    .checkout-summary {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      padding: 24px;
      font-family: 'Inter', sans-serif;
    }
    
    .summary-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .summary-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
    }
    
    .items-count {
      font-size: 14px;
      color: #718096;
      background: #f7fafc;
      padding: 4px 10px;
      border-radius: 20px;
    }
    
    .product-list {
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 20px;
    }
    
    .product-item {
      display: flex;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid #f5f5f5;
    }
    
    .product-item:last-child {
      border-bottom: none;
    }
    
    .product-image {
      width: 70px;
      height: 70px;
      border-radius: 8px;
      overflow: hidden;
      background: #f9f9f9;
    }
    
    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .product-details {
      flex: 1;
    }
    
    .product-name {
      margin: 0 0 6px 0;
      font-size: 15px;
      font-weight: 500;
      color: #2d3748;
      line-height: 1.3;
    }
    
    .product-meta {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #718096;
    }
    
    .price-breakdown {
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;
    }
    
    .price-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 15px;
      color: #4a5568;
    }
    
    .price-row.total {
      margin-top: 16px;
      font-weight: 600;
      font-size: 17px;
      color: #2d3748;
    }
    
    .divider {
      height: 1px;
      background: #f0f0f0;
      margin: 16px 0;
    }
    
    @media (max-width: 768px) {
      .checkout-summary {
        padding: 16px;
      }
    }
  `}</style>
                </section>

                <div id="block-reassurance" className="block-reassurance-cart">
                  <ul>
                    <li>
                      <div className="block-reassurance-item">
                        <img
                          src="assets/images/block-reassurance/1.png"
                          alt="Security policy"
                        />
                        &nbsp;
                        <span className="h6">Security policy</span>
                      </div>
                    </li>
                    <li>
                      <div className="block-reassurance-item">
                        <img
                          src="assets/images/block-reassurance/2.png"
                          alt="Delivery policy"
                        />
                        &nbsp;
                        <span className="h6">Delivery policy</span>
                      </div>
                    </li>
                    <li>
                      <div className="block-reassurance-item">
                        <img
                          src="assets/images/block-reassurance/3.png"
                          alt="Return policy"
                        />
                        &nbsp;
                        <span className="h6">Return policy</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog ">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    lineHeight: "1",
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this address?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    backgroundColor: "#48B7FF",
                    color: "white",
                    padding: "8px 20px",
                    width: "100px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteConfirmed}
                  style={{
                    backgroundColor: "#eb4d7f",
                    color: "white",
                    padding: "8px 20px",
                    width: "100px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CheckOut;
