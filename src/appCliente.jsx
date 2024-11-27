import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});
apiClient.interceptors.request.use((config) => {
  // Recuperar el token desde node-localstorage
  localStorage.getItem("authToken"); // Simula un token
  const token = localStorage.getItem("authToken");
  console.log(`El token es ${token}`)
    if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken"); // Eliminar el token
      window.location.href = "/login"; // Redirigir al login
    }
    return Promise.reject(error);
  }
);




export default apiClient;
