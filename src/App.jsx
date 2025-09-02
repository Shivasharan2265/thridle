import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Products from "./Pages/Products";
import Category from "./Pages/Category";
import SingleBlogPage from "./Pages/SingleBlogPage";
import BlogLeftCol from "./Pages/BlogLeftCol";
import Contact from "./Pages/Contact";
import AboutUs from "./Pages/AboutUs";
import ErrorPage from "./Pages/ErrorPage";
import CheckOut from "./Pages/CheckOut";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CategoryPage from "./Pages/CategoryPage";
import SubCategory from "./Pages/SubCategory";
import SubSubCategory from "./Pages/SubSubCategory";
import Profile from "./Pages/Profile";
import toast, { Toaster } from "react-hot-toast";
import CartPage from "./Pages/CartPage";
import WishList from "./Pages/WishList";
import ScrollToTop from "./ScrollToTop";
import OrderHistory from "./Pages/OrderHistory";
import TermsNConditions from "./Pages/TermsNConditions";
import Blog from "./Pages/Blog";
import BusinessPage from "./Pages/BusinessPage";
import BlogDetails from "./Pages/BlogDetails";
import Faq from "./Pages/Faq";
import Blank from "./Pages/Blank";
import NewArrivals from "./Pages/NewArrivals";

const App = () => {
  return (
    <div id="index">
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
        containerStyle={{
          bottom: "90px",
        }}
      />
      <main>
        <div id="menu_wrapper" className=""></div>

        <Header />
        <ScrollToTop />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Products />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/category-page" element={<CategoryPage />} />
          <Route path="/single-blog" element={<SingleBlogPage />} />
          <Route path="/blog-left-col" element={<BlogLeftCol />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/check-out" element={<CheckOut />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/sub-category/:id" element={<SubCategory />} />
          <Route path="/sub-sub-category" element={<SubSubCategory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart-page" element={<CartPage />} />
          <Route path="/history" element={<OrderHistory />} />
          <Route path="/terms" element={<TermsNConditions />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faq" element={<Faq />} />


 <Route path="/new" element={<NewArrivals />} />


          <Route path="/blog-details" element={<BlogDetails />} />
          <Route path="/page/:slug" element={<BusinessPage />} />

          <Route path="*" element={<Blank />} />
        </Routes>

        <Footer />

        {/* WhatsApp Button Inline */}
      <a
  href="https://api.whatsapp.com/send?phone=919964384555"
  className="whatsapp-float"
  target="_blank"
  rel="noopener noreferrer"
>
  <img
    src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"
    alt="WhatsApp Chat"
    style={{ width: 30, height: 30 }}
  />
</a>


        {/* Inline style block for WhatsApp button */}
        <style>{`
          .whatsapp-float {
            position: fixed;
            bottom: 80px;
            right: 20px;
            z-index: 9999;
            background-color: #25d366;
            padding: 10px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease;
          }
          .whatsapp-float:hover {
            transform: scale(1.1);
          }
        `}</style>
      </main>
    </div>
  );
};

export default App;
