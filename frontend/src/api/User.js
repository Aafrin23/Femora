// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

// export default API;
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.DEV
    ? import.meta.env.VITE_DEV_API_URL
    : import.meta.env.VITE_PROD_API_URL,
});

export default API;