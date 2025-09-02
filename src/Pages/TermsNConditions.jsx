import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Policies.css';
import api from '../utils/api';

const TermsNConditions = () => {
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        const fd = new FormData();
        fd.append("authToken", localStorage.getItem("authToken") || "Guest");
        fd.append("programType", "getBusinessPages");

        try {
            const response = await api.post("/ecom/settings", fd);
            if (response.data.success && Array.isArray(response.data.data)) {
                setPolicies(response.data.data);
            }
        } catch (error) {
            console.error("Policy API Error:", error);
        }
    };

    

    return (
        <div className="policies-container">
            {/* Breadcrumb */}
            <div className="policies-breadcrumb">
                <div className="container">
                    <nav className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>Policies</span>
                    </nav>
                </div>
            </div>

            {/* Main Header */}
            <div className="container policies-content">
                <div className="policy-header-banner">
                    <h1 className="policies-main-title">Our Policies</h1>
                    <p className="policies-intro">
                        We value transparency and want you to shop with confidence. Below you'll find all our policies that govern your shopping experience with us.
                    </p>
                </div>

                {/* Render from API */}
                <div className="policies-accordion">
                    {policies.map((policy, idx) => (
                        <div className="policy-section" key={policy.id}>
                            <input type="checkbox" id={`policy-${idx}`} className="policy-toggle" />
                            <label htmlFor={`policy-${idx}`} className="policy-header">
                                <div className="policy-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                    </svg>
                                </div>
                                <h2>{policy.title}</h2>
                                <span className="policy-toggle-icon">+</span>
                            </label>
                            <div className="policy-content" ><p style={{padding:"20px 15px"}}>{policy.description}</p></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact */}
            <div className="policies-contact">
                <div className="container">
                    <div className="contact-card">
                        <h3>Have Questions?</h3>
                        <p>If you have any questions about our policies, please contact our customer service team.</p>
                        <Link to="/contact" className="contact-btn">Contact Us</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsNConditions;
