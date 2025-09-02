import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import {
  Box,
  Typography,
  Container,
  Paper,
  Skeleton,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const BusinessPage = () => {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      const fd = new FormData();
      fd.append("authToken", localStorage.getItem("authToken") || "Guest");
      fd.append("programType", "getBusinessPages");

      try {
        const response = await api.post("/ecom/settings", fd);
        if (response?.data?.data?.length > 0) {
          const match = response.data.data.find((item) => item.slug === slug);
          setPageData(match);
        }
      } catch (err) {
        console.error("Error fetching business page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [slug]);

  const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};


  

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f8f9fa, #e9ecef)",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            backgroundColor: "#ECF7FF",
            boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              gap: 1,
              color: "primary.main",
            }}
          >
            <InfoOutlinedIcon fontSize="large" />
            {loading ? (
              <Skeleton width={200} height={40} />
            ) : pageData ? (
              <Typography variant="h5" component="h1" fontWeight="bold">
            
              </Typography>
            ) : null}
          </Box>

          {loading ? (
            <>
              <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={30} width="80%" />
            </>
          ) : pageData ? (
         <Box
  className="business-page-content"
  sx={{
    lineHeight: 1.8,
    fontSize: "1.0rem",
    color: "#343a40",
  }}
  dangerouslySetInnerHTML={{ __html: decodeHTML(pageData.description) }}
/>

          ) : (
            <Typography variant="h6" color="error">
              Page not found
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default BusinessPage;
