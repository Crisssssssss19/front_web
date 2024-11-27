import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import apiClient from "../appCliente";
import NavBar from "./navbar";
import Presentacion from "./presentacion";
import Reserva from "./reservas";

const Menu = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/test"); // Ruta protegida en backend
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{background:"black"}}>
      <NavBar></NavBar>
      <Reserva></Reserva>
    </div>
  );
};

export default Menu;
