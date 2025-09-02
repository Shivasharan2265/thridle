import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Blog.css';
import { Skeleton, Box } from '@mui/material';

const Blog = () => {
  const navigate = useNavigate();

  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const fd = new FormData();
    fd.append("authToken", localStorage.getItem("authToken") || "Guest");
    fd.append("programType", "getBlogDetails");

    try {
      const response = await api.post("/ecom/settings", fd);
      console.log("blog", response)
      if (
        response?.data?.success === false &&
        response?.data?.data === "Unauthorized user"
      ) {
        console.warn("Token expired or invalid");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
        return;
      }

      if (response?.data?.success && Array.isArray(response.data.data)) {
        setBlogPosts(response.data.data);
      }
    } catch (error) {
      console.error("Blog API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const stripHtml = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};
const truncate = (text, maxLength = 150) => {
  const stripped = stripHtml(text);
  return stripped.length > maxLength
    ? stripped.slice(0, stripped.lastIndexOf(" ", maxLength)) + "..."
    : stripped;
};


  const renderSkeletons = () => {
    return [...Array(3)].map((_, index) => (
      <Box key={index} className="blog-post" sx={{ mb: 4 }}>
        <Skeleton variant="rectangular" height={220} sx={{ borderRadius: '12px' }} />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" width="80%" height={32} />
          <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="100%" height={72} sx={{ mt: 1.5 }} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mt: 2 }} />
        </Box>
      </Box>
    ));
  };

  return (
    <section className="blog-container">
      <div className="blog-header">
        <h2 className="blog-title">
          Latest Blog Posts
        </h2>
        <p className="blog-subtitle">Discover our latest articles and insights</p>
      </div>

      <div className="blog-grid">
        {loading
          ? renderSkeletons()
          : blogPosts.map((post) => (
              <article key={post.id} className="blog-post"  onClick={() => navigate("/blog-details", { state: post })}>
                <div className="post-image-container">
                  <Link>
                    <img
                      alt={post.title}
                      className="post-image"
                      src={`https://thridle.com/ecom/storage/app/public/blog/image/${post.image}`}
                    />
                    <div className="image-overlay"></div>
                  </Link>
                  <div className="post-meta">
                    <span className="post-date">
                      <i className="fa fa-calendar"></i>{" "}
                      {new Date(post.publish_date).toLocaleDateString("en-GB", {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <div className="post-content">
                  <h3 className="post-title">
                    <Link>{post.title}</Link>
                  </h3>
                  <p className="post-excerpt">
  {post.short_description
    ? stripHtml(post.short_description).slice(0, 150) + "..."
    : stripHtml(post.description).slice(0, 150) + "..."}
</p>

                  <Link 
                   
                    className="read-more"
                  >
                    Read More <i className="fa fa-arrow-right"></i>
                  </Link>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
};

export default Blog;