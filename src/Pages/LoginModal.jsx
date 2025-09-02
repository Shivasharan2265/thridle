// components/LoginModal.js
import React, { useState, useEffect } from "react";
import "./Login.css";
import toast from "react-hot-toast";
import api from "../utils/api";

const LoginModal = ({ onClose, onSuccess }) => {
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

  // Handle countdown tick
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Send OTP function (used for both Get OTP & Resend OTP)
  const sendOtp = async () => {
    if (!username.trim()) {
      setUsernameError("Please enter your phone number.");
      return;
    }
    setUsernameError("");
    setIsLoading(true);

    const fd = new FormData();
    fd.append("phone", username);
    fd.append("programType", "verifyAndSendOTP");

    try {
      const response = await api.post("auth/login_register", fd);
       console.log(response)
      if (response.data.success) {
        toast.success(response.data.message);
        setShowOtpInput(true);
        setViewOtp(response.data.data.otp);
        setIsOtpSent(true);
        setUserId(response.data.data.id);
        setCountdown(30); // Start 30 sec countdown
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetOtp = (e) => {
    e.preventDefault();
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
        localStorage.setItem("authToken", response.data.data.authToken);
        onSuccess(); // ✅ Notify parent
        onClose();   // ✅ Close modal
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Incorrect OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>Please Login to Continue</h4>
        <form onSubmit={isOtpSent ? handleVerifyOtp : handleGetOtp}>
          <div className="form-group mt-4">
            <label style={{ textAlign: "start" }}>Phone Number</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="Enter phone number"
            />
            {usernameError && (
              <small className="error-message">{usernameError}</small>
            )}
          </div>

          {showOtpInput && (
            <div className="form-group">
              <label style={{ textAlign: "start" }}>Enter OTP </label>
              <input
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-input"
                placeholder="Enter OTP"
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

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Loading..." : isOtpSent ? "Verify OTP" : "Get OTP"}
          </button>
        </form>

        <button
          className="login-button"
          style={{ backgroundColor: "#EB4D7F" }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
