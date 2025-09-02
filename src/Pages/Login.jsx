import React, { useState, useEffect } from "react";
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
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  // Countdown state
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const sendOtp = async () => {
    const fd = new FormData();
    fd.append("phone", username);
    fd.append("programType", "verifyAndSendOTP");

    try {
      setIsLoading(true);
      const response = await api.post("auth/login_register", fd);
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        setShowOtpInput(true);
        setViewOtp(response.data.data.otp);
        setIsOtpSent(true);
        setUserId(response.data.data.id);
        setCountdown(30); // Start 30s countdown
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("OTP API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetOtp = (e) => {
    e.preventDefault();
    if (username.trim() === "") {
      setUsernameError("Please enter your username.");
      return;
    }
    setUsernameError("");
    sendOtp();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const fd = new FormData();
    fd.append("username", userId);
    fd.append("programType", "verifyOtp");
    fd.append("otp", otp);

    try {
      const response = await api.post("auth/login_register", fd);
      if (response.data.success) {
        toast.success(response.data.message);
        const token = response.data.data.authToken;
        if (token) {
          localStorage.setItem("authToken", token);
        }
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      toast.error("Incorrect OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1 className="login-title" style={{ color: "#48B7FF" }}>Login</h1>
        <form onSubmit={isOtpSent ? handleVerifyOtp : handleGetOtp} className="login-form-card">
          <div className="form-group">
            <label>Phone</label>
            <input
              className="form-input"
              name="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (usernameError) setUsernameError("");
              }}
              placeholder="Enter your phone number"
            />
            {usernameError && <small className="error-message">{usernameError}</small>}
          </div>

          {showOtpInput && (
            <div className="form-group">
              <label>Enter OTP </label>
              <input
                className="form-input"
                name="otp"
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 4-digit OTP"
              />
              {countdown > 0 ? (
                <small style={{ color: "#777" }}>
                  Resend OTP in {countdown}s
                </small>
              ) : (
                <small
                  style={{ color: "#48B7FF", cursor: "pointer" }}
                  onClick={sendOtp}
                >
                  Resend OTP
                </small>
              )}
            </div>
          )}

          <button
            className="login-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner" style={{ margin: "0" }} role="status" aria-hidden="true"></span>
            ) : isOtpSent ? (
              "Verify OTP"
            ) : (
              "GET OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
