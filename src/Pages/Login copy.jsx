
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./Login.css";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
   const [viewOtp, setViewOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
 
  const [isOtpSent, setIsOtpSent] = useState(false); // To toggle button
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const handleGetOtp = async (e) => {
    e.preventDefault();

    // Validate username
    if (username.trim() === "") {
      setUsernameError("Please enter your username.");
      return;
    } else {
      setUsernameError(""); // Clear any previous errors
    }

    setIsLoading(true);

    const fd = new FormData();
    fd.append("username", username);
    fd.append("programType", "verifyAndSendOTP");

    try {
      const response = await api.post("auth/login_register", fd);
      console.log("OTP Sent:", response);
      if (response.data.success) {
        toast.success(response.data.message)
        setShowOtpInput(true);
        setViewOtp(response.data.data.otp)
        setIsOtpSent(true);
        setUserId(response.data.data.id);
      }
      else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("OTP API Error:", error);
      
    } finally {
      setIsLoading(false);
    }
  };

 const handleVerifyOtp = async (e) => {
  e.preventDefault();

  setIsLoading(true); // 🔁 Start loader

  const fd = new FormData();
  fd.append("username", userId);
  fd.append("programType", "verifyOtp");
  fd.append("otp", otp);

  try {
    const response = await api.post("auth/login_register", fd);
    console.log("OTP Verified:", response.data);

    if (response.data.success) {
      toast.success(response.data.message)
      const token = response.data.data.authToken;
      if (token) {
        localStorage.setItem("authToken", token); // ✅ Store token
      }

      navigate("/");
    } else {
      toast.error(response.data.message)
    }
  } catch (error) {
    console.error("Verify OTP Error:", error);
    toast.error("Incorrect OTP.");
  } finally {
    setIsLoading(false); // 🔁 Stop loader
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

      {/* <div class="breadcrumb-container">
        <nav data-depth="2" class="breadcrumb container">
          <h1 class="h1 category-title breadcrumb-title">Login</h1>
          <ul>
            <li>
              <a href="#">
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span>Login</span>
              </a>
            </li>
          </ul>
        </nav>
      </div> */}

      <section id="wrapper">
        <div className="container">
          <div className="row">
            <div id="content-wrapper" className="col-12">
              <section id="main">
                <div className="login-page">
                  <div className="block-title">
                    <h2 className="title">
                      <span>Login</span>
                    </h2>
                  </div>
                  <form
                    onSubmit={isOtpSent ? handleVerifyOtp : handleGetOtp}
                    className="card"
                  >
                    <div className="login-form">
                      <div className="form-group row">
                        <label className="col-md-3 col-sm-12 form-control-label required">
                          Email
                        </label>
                        <div className="col-md-9 col-sm-12">
                          <input
                            className="form-control"
                            name="email"
                            type="text"
                           
                          />
                        
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-md-3 col-sm-12 form-control-label required">
                          Username
                        </label>
                        <div className="col-md-9 col-sm-12">
                          <input
                            className="form-control"
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => {
                              setUsername(e.target.value);
                              if (usernameError) setUsernameError(""); // Clear error on change
                            }}
                          />
                          {usernameError && (
                            <small className="text-danger">
                              {usernameError}
                            </small>
                          )}
                        </div>
                      </div>

                      {showOtpInput && (
                        <div className="form-group row">
                          <label className="col-md-3 col-sm-12 form-control-label required">
                            Enter OTP ({viewOtp})
                          </label>
                          <div className="col-md-9 col-sm-12">
                            <input
                              className="form-control"
                              name="otp"
                              type="text"
                              maxLength={4}
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Enter 4-digit OTP"
                            />
                          </div>
                        </div>
                      )}
                      <div
                        className="form-group text-center"
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <button
                          className="btn btn-primary fixed-btn"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span
                              className="spinner-border spinner-center"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : isOtpSent ? (
                            "Verify OTP"
                          ) : (
                            "Get OTP"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
