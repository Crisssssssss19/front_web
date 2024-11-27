import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import style from "../css/presentacion.module.css";


function Presentacion() {
  const navigate = useNavigate();

  const irLogin = () => {
    navigate("/login");
  };

  const irSingup = () => {
    navigate("/signup");
  };
  return (
    <>
      <div className={style.containerPrincipal}>
        <div className={style.containerPrecentacion}>
        <h1 class="text-center" style={{ paddingBottom: 60 }}>
              Vuela más lejos, reserva con confianza<tr></tr> C&J Reservations,
              tu pasaporte a nuevas aventuras.
            </h1>
            <div class="d-grid gap-2 d-md-block">
              <button
                onClick={irSingup}
                className={style.botones}
                type="button"
              >
                Singup
              </button>
              <button
                onClick={irLogin}
                className={style.botones}
                type="button"
              >
                Login
              </button>
            </div>
        </div>
      </div>
    </>
  );
}
export default Presentacion;
