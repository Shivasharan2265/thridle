import axios from "axios";

// Create an axios instance with the default headers
const api = axios.create({
    baseURL: " https://thridle.com/api/",

    
    //  baseURL: "http://192.168.1.103/projects/ecomThridle/",


});

// Add the Authorization header to each request
api.interceptors.request.use(
    (config) => {
        const token = "kasejfksjdhfywterjwefbdskgfhsdfjh"; // Get the token from localStorage
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`; // Set the token in the Authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle Unauthorized token globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Error caught in interceptor:", error);

    const response = error.response;

    if (
      response &&
      response.data &&
      (response.data.data === "Unauthorized user" ||
        response.status === 401 ||
        response.data.message === "Unauthorized user")
    ) {
      console.warn("Clearing auth token and redirecting due to unauthorized error");
      localStorage.removeItem("authToken");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }

    return Promise.reject(error);
  }
);


export default api;