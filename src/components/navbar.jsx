import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import apiClient from "../appCliente";

const NavBar = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("test"); // Ruta protegida en backend
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate(); // Hook para manejar la navegación programática

  const handleLogout = (e) => {
    e.preventDefault(); // Prevenir la acción predeterminada del enlace
    localStorage.removeItem("authToken"); // Eliminar el token
    navigate("/login"); // Redirigir al login
  };

  return (
    <>
      <div style={{ display:"flex", justifyContent: "space-around", alignItems: "center" ,background:"rgba(0, 0, 0, 0.7)",height: 70}}>
        <div >
          <Link to="/main"> <img src="/baner.png" alt="Baner" style={{width: 60}} /> </Link>
        </div>
        <div>
          <ul class="nav nav-underline">
            <li class="nav-item">
              <a>
              <Link aria-current="page" class="nav-link" style={{color:"#eac445"}} to="/reservaUser"> Reservas</Link>
              </a>
            </li>
            
            <li class="nav-item">
              <a class="nav-link" style={{color:"#eac445"}} href="/login" onClick={handleLogout}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavBar;
