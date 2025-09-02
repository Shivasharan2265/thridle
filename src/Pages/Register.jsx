import React, { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateUniqueThridleCode = () => {
  const num = Math.floor(100000 + Math.random() * 900000); // e.g., 6-digit number
  return `THRIDLE${num}`;
};


const handleRegister = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const thridleCode = generateUniqueThridleCode();

  const fd = new FormData();
  fd.append('programType', 'registerUser');
  fd.append('f_name', thridleCode);
  fd.append('l_name', thridleCode);
  fd.append('email', `${thridleCode}@example.com`);
  fd.append('phone', phone);

  try {
    const response = await api.post("/auth/login_register", fd);
    console.log("res", response)
    if (response.data.success) {
      const token = response.data.data?.authToken;
      if (token) {
        localStorage.setItem("authToken", token);
      }
      toast.success("Account created successfully!");
      navigate("/");
    } else {
      toast.error(response.data.message || "Failed to register.");
    }
  } catch (error) {
    console.error('Register API Error:', error);
    toast.error("Error creating account.");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="register-container">


      {/* Registration Form */}
      <div className="register-form-container">
        <h1 className="register-title"  style={{color:"#48B7FF"}}>Create Account</h1>
        <form onSubmit={handleRegister} className="register-form-card">
          {/* <div className="form-group">
            <label>First Name</label>
            <input
              className="form-input"
              name="firstname"
              type="text"
              value={fName}
              onChange={(e) => setFName(e.target.value)}
              placeholder="Enter your first name"
              
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              className="form-input"
              name="lastname"
              type="text"
              value={lName}
              onChange={(e) => setLName(e.target.value)}
              placeholder="Enter your last name"
              
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-input"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              
            />
          </div> */}
          <div className="form-group">
            <label>Phone</label>
            <input
              className="form-input"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          
          <button
            className="register-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner" role="status" aria-hidden="true"></span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;