import React, { useEffect, useState } from 'react'
import { FaFacebook, FaGooglePlusG, FaRss, FaTwitter, FaYoutube } from 'react-icons/fa'
import api from '../utils/api';
import { Link } from 'react-router-dom';

const Contact = () => {

   const [companyData, setCompanyData] = useState({});
  
    useEffect(() => {
      const fetchCompanyDetails = async () => {
        const fd = new FormData();
        fd.append("authToken", localStorage.getItem("authToken") || "Guest");
        fd.append("programType", "getCompanyDetails");
  
        try {
          const response = await api.post("/ecom/company", fd);
          console.log("response", response);
          if (response?.data?.success) {
            const details = response.data.data;
            const dataMap = {};
            details.forEach((item) => {
              dataMap[item.type] = item.value;
            });
            setCompanyData(dataMap);
          }
        } catch (error) {
          console.error("Company API Error:", error);
        }
      };
  
      fetchCompanyDetails();
    }, []);
  return (
    <div>
       <div id="mobile_top_menu_wrapper" class="hidden-lg-up" style={{display:"none"}}>
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
                        <span>Contact</span>
                    </nav>
                </div>
            </div>

     <section id="wrapper">
      <div id="content-wrapper" class="top-wrapper">
        <div class="container">
          <div class="row">
            <section id="main">
              <div class="contact-form-information" style={{paddingBottom:"0"}}>
                <div class="row">
                  <div class="contact-banner col-lg-6 col-md-12">
                    <div class="image-container">
                      <a href="javascript:void(0);">
                        <img
                        src="assets/images/contact-image.png"
                        alt="contact-image"/>
                      </a>
                    </div>
                  </div>
                  <div class="information-container col-lg-6 col-md-12">
                    <div class="title-container">
                      <h3 class="heading">get in touch</h3>
                      <span class="subheading">We&#39;d Love to Hear From You, Lets Get In Touch!</span>
                    </div>
                    <div class="list-contact-info col-md-12 col-sm-12 col-xs-12">
                      <div class="contact_info_item col-md-6 col-sm-6 col-xs-6">
                       <h3>address</h3>
                     <p>{companyData.shop_address || "Not Available"}</p>

                      </div>
                      <div class="contact_info_item col-md-6 col-sm-6 col-xs-6">
                        <h3>Phone</h3>
                         <p>{companyData.company_phone || "Not Available"}</p>
                      </div>
                      <div class="contact_info_item col-md-6 col-sm-6 col-xs-6">
                        <h3>Email</h3>
                        <p>
                          <a href={`mailto:${companyData.company_email || ""}`}>
  {companyData.company_email || "Not Available"}
</a>

                        </p>
                      </div>
                      {/* <div class="contact_info_item col-md-6 col-sm-6 col-xs-6">
                        <h3>additional Information</h3>
                        <p>We are open: Monday - Saturday, 10AM - 5PM and colsed on sunday sorry for that.</p>
                      </div> */}
                      <div class="contact_info_item block-social col-md-12 col-sm-12 col-xs-12">
                        <h3>Social</h3>
                        <ul className="social-inner">
      <li className="facebook">
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaFacebook style={{color:"white", marginTop:"10px"}}  />
          <span className="socialicon-label">Facebook</span>
        </a>
      </li>
      <li className="twitter">
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaTwitter style={{color:"white", marginTop:"10px"}} />
          <span className="socialicon-label">Twitter</span>
        </a>
      </li>
      <li className="rss">
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaRss style={{color:"white", marginTop:"10px"}}  />
          <span className="socialicon-label">Rss</span>
        </a>
      </li>
      <li className="youtube">
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaYoutube style={{color:"white", marginTop:"10px"}}  />
          <span className="socialicon-label">YouTube</span>
        </a>
      </li>
      <li className="googleplus">
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaGooglePlusG style={{color:"white", marginTop:"10px"}}  />
          <span className="socialicon-label">Google +</span>
        </a>
      </li>
    </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        {/* <div class="contact-map clearfix">
          <div id="contact-map">
            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4942.998389285883!2d72.86381628231031!3d21.235140418614346!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xc781696a0f9b3ea0!2sIshi%20Technolabs!5e0!3m2!1sen!2sin!4v1594468091731!5m2!1sen!2sin" width="100%" height="400" frameborder="0" style={{border:"0"}} allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
          </div>
        </div> */}
        <div class="container">
          <div class="contact-form-bottom">
            <div class="contact-form form-vertical">
              <div class="title-container">
                <h3 class="heading">leave us a message</h3>
                <span class="subheading">-good for nature, good for you-</span>
              </div>
              <section class="form-field">
                <form method="post" action="#" id="contact_form" class="contact-form">
                  <div class="form-fields row">
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 form-group">
                      <label for="ContactFormName" class="hidden control-label">Name</label>
                      <input type="text" id="ContactFormName" class="form-control" name="contact[name]" value="" placeholder="Name"/>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 form-group">
                      <label for="ContactFormEmail" class="hidden">Email</label>
                      <input type="email" id="ContactFormEmail" class="form-control" name="contact[email]" autocapitalize="off" value="" placeholder="Email"/>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 form-group">
                      <label for="ContactFormPhone" class="hidden">Phone</label>
                      <input type="text" id="ContactFormPhone" class="form-control" name="contact[phone]" value="" placeholder="Phone"/>
                    </div>              
                    <div class="form-group-area col-lg-12 col-md-12 col-sm-12 col-xs-12 form-group">
                      <label for="ContactFormMessage" class="hidden">Message</label>
                      <textarea rows="10" id="ContactFormMessage" class="form-control" name="contact[body]" placeholder="your message"></textarea>
                    </div>
                    <div class="submit-button col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <input class="btn btn-primary" name="submitMessage" value="Send" type="submit"/>
                    </div>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}

export default Contact
