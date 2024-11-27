import React, { useEffect, useState } from "react";
import styleRe from "../css/reserva.module.css";
import ".././index.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import apiClient from "../appCliente";
import DatePicker from "react-datepicker";
import axios from "axios";

const Reserva = () => {
  const [date, setDate] = useState(null); // Fecha seleccionada
  const [origin, setOrigin] = useState(""); // Origen seleccionado
  const [destination, setDestination] = useState(""); // Destino seleccionado
  const [userName, setUserName] = useState(""); // Nombre del usuario
  const [locations, setLocations] = useState([]); // Todas las locaciones
  const [filteredDestinations, setFilteredDestinations] = useState([]); // Destinos filtrados
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [passengers, setPassengers] = useState(1); // Número de pasajeros
  const [filteredFlights, setFilteredFlights] = useState([]); // Vuelos filtrados
  const [showResults, setShowResults] = useState(false); // Mostrar resultados

  const [formData, setFormData] = useState({
    id: null, // Long en Java, null como valor inicial en JS
    fechaReserva: "", // Date en Java, cadena ISO 8601 o similar en JS fecha del dia que el usuario hizo la reserva
    numeroDePasajeros: 1, // Integer en Java
    clientes: [], // Lista de UsuarioDto, representada como un array en JS, aca va id cliente
    vuelos: [], // Lista de VueloDto, representada como un array en JS, aca va el id del vuelo
    id_reserva: null, // PasajeroDto en Java, objeto o null en JS
  });

  const reservaChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReserva = async (event) => {
    event.preventDefault();

    try {
      const reservaData = await fetch(
        "http://localhost:8080/api/0.1/reservas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (reservaData.ok) {
        const datosReserva = await response.json();
        console.log("Reserva exitosa: " + JSON.String(datosReserva));
      }
    } catch (error) {
      console.error("Error en la conexión con el servidor", error);
    }
  };

  // Obtener locaciones y nombre del usuario al cargar el componente
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await apiClient.get("0.1/locaciones");
        const userData = await apiClient.get(
          `0.1/clientes/idCliente/${localStorage.getItem("idUser")}`
        );
        const reservasDelUsuario = await apiClient.get("0.1/reservas");
        console.log("Reservas", reservasDelUsuario.data);
        setUserName(userData.data.nombre);

        if (Array.isArray(response.data)) {
          setLocations(response.data);
          setFilteredDestinations(response.data);
        } else {
          console.error("La respuesta no contiene un arreglo.", response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener locaciones:", error);
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Actualizar destinos disponibles cuando cambie el origen
  useEffect(() => {
    if (origin) {
      setFilteredDestinations(
        locations.filter((location) => String(location.id) !== String(origin))
      );
    } else {
      setFilteredDestinations(locations);
    }
  }, [origin, locations]);

  // Función para buscar vuelos
  const buscarVuelos = async (event) => {
    event.preventDefault();
    try {
      const vuelos = await apiClient.get("0.1/vuelos");
      const vuelosFiltrados = vuelos.data.filter((vuelo) => {
        const vueloFecha = new Date(vuelo.fechaDeSalida);
        return (
          vuelo.origen.id === Number(origin) &&
          vuelo.destino.id === Number(destination) &&
          (!date || vueloFecha >= date)
        );
      });

      setFilteredFlights(vuelosFiltrados); // Actualizar vuelos filtrados
      setShowResults(true); // Mostrar resultados
      localStorage.setItem("vuelos", JSON.stringify(vuelosFiltrados));
    } catch (error) {
      alert("Error al buscar vuelos");
      console.error(error);
    }
  };

  const reservarVuelo = async (vuelo) => {
    const idCliente = localStorage.getItem("idUser");
    const fechaActual = new Date().toISOString();

    if (!idCliente) {
      alert("Error: No se encontró el ID del cliente. Inicia sesión.");
      return;
    }

    const reservaData = {
      fechaReserva: fechaActual,
      numeroDePasajeros: passengers,
      clientes: [{ id: localStorage.getItem('idUser') }], // ID del cliente en el formato esperado
      vuelos: [{ id: vuelo.id }], // ID del vuelo en el formato esperado
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/0.1/reservas",
        reservaData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert(`Reserva exitosa. ID de la reserva: ${response.data.id}`);
        console.log("Datos de la reserva:", response.data);
      } else {
        console.error("Respuesta inesperada:", response);
        alert("Hubo un problema al procesar la reserva. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error al reservar el vuelo:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className={styleRe.reservaFont}>
      <div className={styleRe.divPrincipal}>
        <form onSubmit={buscarVuelos}>
          {/* Formulario de búsqueda */}
          <div className={styleRe.divSecundario}>
            <div
              className="form-check"
              style={{ display: "inline-flex", paddingRight: 10 }}
            >
              <>Hello {userName}, Where do you want to travel today?</>
            </div>
          </div>
          <div
            className="max-w-6xl mx-auto p-4 bg-white"
            style={{ borderRadius: 20 }}
          >
            <div className="row g-2">
              {/* Selector de origen */}
              <div className="col-md">
                <div className="form-floating">
                  <select
                    className="form-select"
                    id="originSelect"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                    value={origin}
                    onChange={(e) => {
                      setOrigin(e.target.value);
                      setDestination("");
                    }}
                  >
                    <option value="" disabled>
                      Select your origin city
                    </option>
                    {loading ? (
                      <option>Loading...</option>
                    ) : (
                      locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.nombre} ({location.siglas})
                        </option>
                      ))
                    )}
                  </select>
                  <label htmlFor="originSelect">City of origin</label>
                </div>
              </div>

              {/* Selector de destino */}
              <div className="col-md">
                <div className="form-floating">
                  <select
                    className="form-select"
                    id="destinationSelect"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    disabled={!origin}
                  >
                    <option value="" disabled>
                      Select your destination city
                    </option>
                    {loading ? (
                      <option>Loading...</option>
                    ) : (
                      filteredDestinations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.nombre} ({location.siglas})
                        </option>
                      ))
                    )}
                  </select>
                  <label htmlFor="destinationSelect">City of destination</label>
                </div>
              </div>

              {/* Selector de fecha */}
              <div className="col-md">
                <div className="form-floating">
                  <div className="position-relative">
                    <DatePicker
                      className="form-control"
                      selected={date}
                      onChange={(date) => setDate(date)}
                      minDate={new Date()}
                      placeholderText="Select your flight date"
                      id="flightDate"
                    />
                  </div>
                </div>
              </div>

              {/* Selector de pasajeros */}
              <div className="col-md">
                <div className="form-floating">
                  <input
                    type="number"
                    className="form-control"
                    id="passengers"
                    min="1"
                    max="9"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                  />
                  <label htmlFor="passengers">Number of passengers</label>
                </div>
              </div>
            </div>
            <div className="d-grid" style={{ marginTop: 30 }}>
              <button
                style={{ borderRadius: 50, background: "blue" }}
                className="btn"
                type="submit"
              >
                Buscar vuelos
              </button>
            </div>
          </div>
        </form>
      </div>
      <div style={{ marginTop: 20 }}>
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
    </div>
  );
};

export default Reserva;
