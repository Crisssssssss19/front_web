import React, { useEffect, useState } from "react";
import styleRe from "../css/reserva.module.css";

const ReservaUsuario = () =>{
    return(
        <>
        
        <div style={{ marginTop: 20}}>
        {/* Tabla de resultados */}
        {showResults && filteredFlights.length > 0 && (
          <div
            className={styleRe.divPrincipal}
            style={{
              paddingRight: 30,
              paddingLeft: 30,
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <div
              className="table-responsive mt-4"
              style={{ textAlign: "center" }}
            >
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ background: "transparent" }}>ID</th>
                    <th style={{ background: "transparent" }}>Origin</th>
                    <th style={{ background: "transparent" }}>Destination</th>
                    <th style={{ background: "transparent" }}>
                      Departure Date
                    </th>
                    <th style={{ background: "transparent" }}>
                      Duration (min)
                    </th>
                    <th style={{ background: "transparent" }}>Capacity</th>
                    <th style={{ background: "transparent" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFlights.map((flight) => (
                    <tr key={flight.id}>
                      <td style={{ background: "transparent" }}>{flight.id}</td>
                      <td style={{ background: "transparent" }}>
                        {flight.origen.nombre}
                      </td>
                      <td style={{ background: "transparent" }}>
                        {flight.destino.nombre}
                      </td>
                      <td style={{ background: "transparent" }}>
                        {new Date(flight.fechaDeSalida).toLocaleString()}
                      </td>
                      <td style={{ background: "transparent" }}>
                        {flight.duracion}
                      </td>
                      <td style={{ background: "transparent" }}>
                        {flight.capacidad}
                      </td>
                      <td style={{ background: "transparent" }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => reservarVuelo(flight)}
                        >
                          Reservar vuelo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
        </>
    )
}
export default ReservaUsuario;