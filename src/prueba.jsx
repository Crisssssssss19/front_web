import React, { useEffect } from "react";
import axios from "axios";

const TestRequest = () => {
  useEffect(() => {
    const testRequest = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Obtén el token almacenado
        const response = await axios.get("http://localhost:8080/api/test", {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token si existe
            "Content-Type": "application/json",
          },
        });
        console.log("Respuesta del servidor:", response.data);
      } catch (error) {
        console.error("Error en la solicitud:", error.response || error.message);
      }
    };

    testRequest();
  }, []);

  return <div>Revisa la consola del navegador para ver los resultados.</div>;
};

export default TestRequest;
