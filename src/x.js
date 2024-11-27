import axios from "axios";
import { LocalStorage } from "node-localstorage";

// Configuración de localStorage en Node.js
const localStorage = new LocalStorage("./scratch");

const testRequest = async () => {
  try {
    localStorage.setItem("authToken","eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJDcmlzIiwiaWF0IjoxNzMyNDk2NzA0fQ.BHK-siyLBHnmv7Miz7s34HS6Es4KlsWpQ2iep_YlvOw"); // Simula un token
    const token = localStorage.getItem("authToken");
    console.log(token);
    const response = await axios.get("http://localhost:8080/api/test", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Respuesta del servidor:", response.data);
  } catch (error) {
    console.error("Error en la solicitud:", error.response || error.message);
  }
};

testRequest();
