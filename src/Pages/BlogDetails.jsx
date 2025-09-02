import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUserEdit, FaArrowLeft } from 'react-icons/fa';
import './BlogDetails.css';


const BlogDetails = () => {
  const { state: post } = useLocation();
  const navigate = useNavigate();

  if (!post) {
    navigate("/");
    return null;
  }

  return (
    <div className="blog-details-wrapper">
         <button className="back-button" onClick={() => navigate("/blog")}>
        <FaArrowLeft /> Back to Blog
      </button>
    <header className="blog-header">
          <h1 className="blog-details-title">{post.title}</h1>
          
          <div className="blog-details-meta">
            <span className="meta-item">
              <FaUserEdit className="meta-icon" /> {post.writer || 'Admin'}
            </span>
            <span className="meta-item">
              <FaCalendarAlt className="meta-icon" /> 
              {new Date(post.publish_date).toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="meta-item read-time">
              ⏱️ {Math.ceil(post.description.length / 1500)} min read
            </span>
          </div>
        </header>
      
      <article className="blog-details-container">
        <div className="blog-details-content">
              

        </div>
      
        <div className="featured-image-container">
          <img
            src={`https://thridle.com/ecom/storage/app/public/blog/image/${post.image}`}
            alt={post.title}
            className="blog-details-image"
          />
         
        </div>

        <div 
          className="blog-details-content"
          dangerouslySetInnerHTML={{ __html: post.description }}
        />

        <footer className="blog-footer">
          <div className="tags-container">
            {post.tags && post.tags.split(',').map((tag, index) => (
              <span key={index} className="tag">{tag.trim()}</span>
            ))}
          </div>
         
        </footer>
      </article>
    </div>
  );
};

export default BlogDetails;