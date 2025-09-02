import React, { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Profile.css"
const Profile = () => {
  const [addressListData, setAddressListData] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  // State at the top of Profile component
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [showAddresses, setShowAddresses] = useState(true);


  const [addressData, setAddressData] = useState({
    contact_person_name: "",
    email: "",
    address_type: "home", // or "office"
    address: "",
    city: "",
    zip: "",
    phone: "",
    state: "",
    country: "India",
    isPrimary: "no",
  });
  const [profile, setProfile] = useState({
    f_name: "",
    l_name: "",
    email: "",
    phone: "",
  });
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
          phone: user.phone?.replace(/^\+91/, "") || "",  // ✅ strip +91
        });
      }
    } catch (error) {
      console.error("Profile Error:", error);
    }
  };
  const profileUpdate = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "updateProfile");
    fd.append("f_name", profile.f_name);
    fd.append("l_name", profile.l_name);
    fd.append("email", profile.email);
    fd.append("phone", profile.phone);

    try {
      const response = await api.post("/users/user", fd);
      console.log("Update", response);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to update profile.");
    }
  };
  useEffect(() => {
    profileDetails();
    addressList();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };
  const addAddress = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "contact_person_name",
      "email",
      "address",
      "city",
      "state",
      "zip",
      "phone",
    ];

    let newErrors = {};
    requiredFields.forEach((field) => {
      if (!addressData[field]?.trim()) {
        newErrors[field] = "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstError = document.querySelector(".error-input");
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors({}); // Clear previous errors

    // ✅ Continue with your existing API code here
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "addShippingAddress");
    Object.entries(addressData).forEach(([key, value]) => {
      fd.append(key, value);
    });

    try {
      const response = await api.post("/users/user", fd);
      if (response.data.success) {
        toast.success(response.data.message);
        addressList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add address.", error);
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
  const updateAddress = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "updateShippingAddress");
    fd.append("id", selectedAddressId);
    fd.append("contact_person_name", addressData.contact_person_name);
    fd.append("email", addressData.email);
    fd.append("address_type", addressData.address_type);
    fd.append("address", addressData.address);
    fd.append("city", addressData.city);
    fd.append("zip", addressData.zip);
    fd.append("phone", addressData.phone);
    fd.append("state", addressData.state);
    fd.append("country", addressData.country);

    try {
      const response = await api.post("/users/user", fd);
      console.log("Update Address", response);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      if (addressData.isPrimary === "yes") {
        await defaultAddress(selectedAddressId);
      }
      setSelectedAddressId(null);
      setAddressData({
        contact_person_name: "",
        email: "",
        address_type: "home",
        address: "",
        city: "",
        zip: "",
        phone: "",
        state: "",
        country: "India",
      });
      addressList();
    } catch (error) {
      console.error("Update Address Error:", error);
      toast.error("Failed to update address.");
    }
  };
  const defaultAddress = async (id) => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "makePrimary");
    fd.append("id", id);

    try {
      const response = await api.post("/users/user", fd);
      console.log("Default:", response);

      addressList(); // Refresh list to reflect default tag
    } catch (error) {
      console.error("Default Error:", error);
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

  return (
    <div className="profile-page" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header Section */}
      <div className="profile-header" style={{
        background: "linear-gradient(135deg, #EB4D7F 0%, #FF9A8B 100%)",

        padding: "30px 0",
        color: "white",
        marginBottom: "30px"
      }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <nav className="breadcrumb" style={{ background: "transparent", padding: 0 }}>
              <Link to="/" style={{ color: "rgba(255,255,255,0.8)" }}>Home</Link>
              <span style={{ color: "rgba(255,255,255,0.5)", margin: "0 8px" }}>/</span>
              <span style={{ color: "white" }}>Profile</span>
            </nav>

            <Link
              to="/history"
              className="btn btn-light"
              style={{
                fontWeight: "600",
                padding: "8px 20px",
                borderRadius: "30px",
                fontSize: "14px",
                color: "#fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              My Orders
            </Link>
          </div>

          <div className="text-center mt-4">
            <div style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.2)",
              margin: "0 auto 15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              fontWeight: "bold",
              color: "white"
            }}>
              {profile.f_name.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ fontWeight: "700", marginBottom: "5px", color: "#fff" }}>
              {profile.f_name} {profile.l_name}
            </h2>
            <p style={{ opacity: 0.9, marginBottom: "0", color: "#fff" }}>{profile.email}</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginBottom: "50px" }}>
        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8 mx-auto">
            {/* Personal Information Card */}
            <div className="card mb-4" style={{
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              overflow: "hidden"
            }}>
              <div className="card-header"
                onClick={() => setShowPersonalInfo(prev => !prev)} style={{
                  backgroundColor: "white",
                  padding: "20px 25px",
                  borderBottom: "1px solid rgba(0,0,0,0.05)"
                }}>
                <h3 className="mb-0" style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontWeight: "600",
                  color: "#2d3436"
                }}>
                  <span style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: "#48B7FF",
                    borderRadius: "50%",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px"
                  }}>1</span>
                  Personal Information
                </h3>
              </div>

              {showPersonalInfo && (

                <div className="card-body" style={{ padding: "25px" }}>
                  <form onSubmit={profileUpdate}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label" style={{ fontWeight: "500", color: "#636e72" }}>First name</label>
                        <input
                          className="form-control"
                          style={{
                            padding: "12px 15px",
                            borderRadius: "8px",
                            border: "1px solid #dfe6e9"
                          }}
                          name="f_name"
                          type="text"
                          value={profile.f_name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label" style={{ fontWeight: "500", color: "#636e72" }}>Last name</label>
                        <input
                          className="form-control"
                          style={{
                            padding: "12px 15px",
                            borderRadius: "8px",
                            border: "1px solid #dfe6e9"
                          }}
                          name="l_name"
                          type="text"
                          value={profile.l_name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label" style={{ fontWeight: "500", color: "#636e72" }}>Email</label>
                      <input
                        className="form-control"
                        style={{
                          padding: "12px 15px",
                          borderRadius: "8px",
                          border: "1px solid #dfe6e9"
                        }}
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label" style={{ fontWeight: "500", color: "#636e72" }}>Phone</label>
                      <input
                        className="form-control"
                        style={{
                          padding: "12px 15px",
                          borderRadius: "8px",
                          border: "1px solid #dfe6e9"
                        }}
                        name="phone"
                        type="text"
                        value={profile.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="d-flex justify-content-end">
                      <button
                        className="btn"
                        style={{
                          backgroundColor: "#48B7FF",
                          color: "white",
                          fontWeight: "600",
                          padding: "10px 25px",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 2px 10px rgba(72, 183, 255, 0.3)",
                          transition: "all 0.3s"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#3a9de3"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#48B7FF"}
                      >
                        Update Profile
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Addresses Card */}
            <div className="card" style={{
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              overflow: "hidden"
            }}>
              <div className="card-header"
                onClick={() => setShowAddresses(prev => !prev)}
                style={{
                  backgroundColor: "white",
                  padding: "20px 25px",
                  borderBottom: "1px solid rgba(0,0,0,0.05)"
                }}>
                <h3 className="mb-0" style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontWeight: "600",
                  color: "#2d3436"
                }}>
                  <span style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: "#48B7FF",
                    borderRadius: "50%",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px"
                  }}>2</span>
                  My Addresses
                </h3>
              </div>
              {showAddresses && (
                <div className="card-body" style={{ padding: "25px" }}>
                  {/* Address List */}
                  <div className="row">
                    {addressListData.map((item) => (
                      <div className="col-md-6 mb-3" key={item.id}>
                        <div
                          className="card h-100"
                          style={{
                            border: selectedAddressId === item.id ? "2px solid #48B7FF" : "1px solid #dfe6e9",
                            borderRadius: "10px",
                            transition: "all 0.3s",
                            cursor: "pointer",
                            backgroundColor: selectedAddressId === item.id ? "#f0f9ff" : "white"
                          }}
                          onClick={() => {
                            setAddressData({ ...item, isPrimary: item.isDefault === 1 ? "yes" : "no" });
                            setSelectedAddressId(item.id);
                          }}
                        >
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h5 className="card-title" style={{
                                  fontWeight: "600",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px"
                                }}>

                                  {item.contact_person_name}
                                </h5>
                                {item.isDefault === 1 && (
                                  <span style={{
                                    backgroundColor: "#48B7FF",
                                    color: "white",
                                    padding: "3px 10px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    display: "inline-block",
                                    marginBottom: "10px"
                                  }}>
                                    Default
                                  </span>
                                )}
                              </div>
                              <FaTrash
                                style={{
                                  color: "#eb4d7f",
                                  cursor: "pointer",
                                  padding: "8px",
                                  borderRadius: "50%",
                                  transition: "all 0.2s"
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = "rgba(235, 77, 127, 0.1)"}
                                onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAddressToDelete(item.id);
                                  setShowDeleteModal(true);
                                }}
                              />
                            </div>

                            <div style={{ color: "#636e72", marginTop: "10px" }}>
                              <div style={{ marginBottom: "5px" }}>
                                <strong>Email:</strong> {item.email}
                              </div>
                              <div style={{ marginBottom: "5px" }}>
                                <strong>Phone:</strong> {item.phone}
                              </div>
                              <div>
                                <strong>Address:</strong> {item.address}, {item.city}, {item.state} - {item.zip}, {item.country}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Address Form */}
                  <form onSubmit={selectedAddressId ? updateAddress : addAddress}>
                    <h4 style={{
                      fontWeight: "600",
                      color: "#2d3436",
                      margin: "25px 0 15px",
                      paddingBottom: "10px",
                      borderBottom: "1px solid #dfe6e9"
                    }}>
                      {selectedAddressId ? "Edit Address" : "Add New Address"}
                    </h4>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label" style={{ fontWeight: "500", color: "#636e72" }}>Full Name</label>
                        <input
                          className={`form-control ${errors.contact_person_name ? "is-invalid" : ""}`}
                          style={{
                            padding: "12px 15px",
                            borderRadius: "8px",
                            border: errors.contact_person_name ? "1px solid #EB4D7F" : "1px solid #dfe6e9"
                          }}
                          name="contact_person_name"
                          value={addressData.contact_person_name}
                          onChange={handleAddressChange}
                          type="text"
                        />
                        {errors.contact_person_name && (
                          <div className="invalid-feedback d-block" style={{ fontSize: "14px" }}>
                            {errors.contact_person_name}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label" style={{ fontWeight: "500", color: "#636e72" }}>Email</label>
                        <input
                          className={`form-control ${errors.email ? "is-invalid" : ""}`}
                          style={{
                            padding: "12px 15px",
                            borderRadius: "8px",
                            border: errors.email ? "1px solid #EB4D7F" : "1px solid #dfe6e9"
                          }}
                          name="email"
                          value={addressData.email}
                          onChange={handleAddressChange}
                          type="email"
                        />
                        {errors.email && (
                          <div className="invalid-feedback d-block" style={{ fontSize: "14px" }}>
                            {errors.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label" style={{ fontWeight: "500", color: "#636e72" }}>Address</label>
                      <input
                        className={`form-control ${errors.address ? "is-invalid" : ""}`}
                        style={{
                          padding: "12px 15px",
                          borderRadius: "8px",
                          border: errors.address ? "1px solid #EB4D7F" : "1px solid #dfe6e9"
                        }}
                        name="address"
                        value={addressData.address}
                        onChange={handleAddressChange}
                        type="text"
                      />
                      {errors.address && (
                        <div className="invalid-feedback d-block" style={{ fontSize: "14px" }}>
                          {errors.address}
                        </div>
                      )}
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label" style={{ fontWeight: "500", color: "#636e72" }}>City</label>
                        <input
                          className={`form-control ${errors.city ? "is-invalid" : ""}`}
                          style={{
                            padding: "12px 15px",
                            borderRadius: "8px",
                            border: errors.city ? "1px solid #EB4D7F" : "1px solid #dfe6e9"
                          }}
                          name="city"
                          value={addressData.city}
                          onChange={handleAddressChange}
                          type="text"
                        />
                        {errors.city && (
                          <div className="invalid-feedback d-block" style={{ fontSize: "14px" }}>
                            {errors.city}
                          </div>
                        )}
                      </div>

                      <div className="col-md-4 mb-3">
                        <label className="form-label" style={{ fontWeight: "500", color: "#636e72" }}>State</label>
                        <input
                          className={`form-control ${errors.state ? "is-invalid" : ""}`}
                          style={{
                            padding: "12px 15px",
                            borderRadius: "8px",
                            border: errors.state ? "1px solid #EB4D7F" : "1px solid #dfe6e9"
                          }}
                          name="state"
                          value={addressData.state}
                          onChange={handleAddressChange}
                          type="text"
                        />
                        {errors.state && (
                          <div className="invalid-feedback d-block" style={{ fontSize: "14px" }}>
                            {errors.state}
                          </div>
                        )}
                      </div>

                      <div className="col-md-4 mb-3">
                        <label className="form-label" style={{ fontWeight: "500", color: "#636e72" }}>Zip Code</label>
                        <input
                          className={`form-control ${errors.zip ? "is-invalid" : ""}`}
                          style={{
                            padding: "12px 15px",
                            borderRadius: "8px",
                            border: errors.zip ? "1px solid #EB4D7F" : "1px solid #dfe6e9"
                          }}
                          name="zip"
                          value={addressData.zip}
                          onChange={handleAddressChange}
                          type="text"
                        />
                        {errors.zip && (
                          <div className="invalid-feedback d-block" style={{ fontSize: "14px" }}>
                            {errors.zip}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label" style={{ fontWeight: "500", color: "#636e72" }}>Phone</label>
                        <input
                          className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                          style={{
                            padding: "12px 15px",
                            borderRadius: "8px",
                            border: errors.phone ? "1px solid #EB4D7F" : "1px solid #dfe6e9"
                          }}
                          name="phone"
                          value={addressData.phone}
                          onChange={handleAddressChange}
                          type="text"
                        />
                        {errors.phone && (
                          <div className="invalid-feedback d-block" style={{ fontSize: "14px" }}>
                            {errors.phone}
                          </div>
                        )}
                      </div>


                    </div>

                    <div className="mb-4">
                      <label className="form-label" style={{ fontWeight: "500", color: "#636e72" }}>Set as Primary Address</label>
                      <div className="d-flex gap-3">
                        <div className="primary-toggle">
                          <label
                            className={`primary-option ${addressData.isPrimary === "yes" ? "selected" : ""}`}
                          >
                            <input
                              type="radio"
                              name="isPrimary"
                              value="yes"
                              checked={addressData.isPrimary === "yes"}
                              onChange={handleAddressChange}
                            />
                            Yes
                          </label>

                          <label
                            className={`primary-option ${addressData.isPrimary === "no" ? "selected" : ""}`}
                          >
                            <input
                              type="radio"
                              name="isPrimary"
                              value="no"
                              checked={addressData.isPrimary === "no"}
                              onChange={handleAddressChange}
                            />
                            No
                          </label>
                        </div>

                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-3">
                      {selectedAddressId && (
                        <button
                          type="button"
                          className="btn"
                          style={{
                            backgroundColor: "transparent",
                            color: "#636e72",
                            fontWeight: "600",
                            padding: "10px 25px",
                            borderRadius: "8px",
                            border: "1px solid #dfe6e9",
                            transition: "all 0.3s"
                          }}
                          onClick={() => {
                            setSelectedAddressId(null);
                            setAddressData({
                              contact_person_name: "",
                              email: "",
                              address_type: "home",
                              address: "",
                              city: "",
                              zip: "",
                              phone: "",
                              state: "",
                              country: "India",
                              isPrimary: "no",
                            });
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = "#f1f1f1"}
                          onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        type="submit"
                        className="btn"
                        style={{
                          backgroundColor: "#48B7FF",
                          color: "white",
                          fontWeight: "600",
                          padding: "10px 25px",
                          borderRadius: "8px",
                          border: "none",
                          marginLeft: "5px",
                          boxShadow: "0 2px 10px rgba(72, 183, 255, 0.3)",
                          transition: "all 0.3s"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#3a9de3"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#48B7FF"}
                      >
                        {selectedAddressId ? "Update Address" : "Add Address"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    lineHeight: "1",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowDeleteModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this address?
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button
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

export default Profile;
