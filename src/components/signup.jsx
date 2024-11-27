import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styleLog from '../css/login.module.css'
import stylePre from "../css/presentacion.module.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    fechaNacimiento: "",
    username: "",
    password: "",
    email: "",
    roles: ["ROLE_USER"],
  });
  
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(true); // Controla la visibilidad de la siguiente sección
  const [registrationError, setRegistrationError] = useState(null); // Estado para manejar el error de registro

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función de validación para la primera sección
  const validateFirstSection = () => {
    let formErrors = {};
    let isValid = true;

    // Validación de campos (primera sección)
    if (!formData.nombre) {
      formErrors.nombre = "First name is required.";
      isValid = false;
    }

    if (!formData.apellido) {
      formErrors.apellido = "Last name is required.";
      isValid = false;
    }

    if (!formData.direccion) {
      formErrors.direccion = "Address is required.";
      isValid = false;
    }

    if (!formData.telefono) {
      formErrors.telefono = "Phone number is required.";
      isValid = false;
    } else if (!/^\d+$/.test(formData.telefono)) {
      formErrors.telefono = "Phone number must be numeric.";
      isValid = false;
    }

    if (!formData.fechaNacimiento) {
      formErrors.fechaNacimiento = "Date of birth is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Función de validación para la segunda sección (email, username, password)
  const validateSecondSection = () => {
    let formErrors = {};
    let isValid = true;

    // Validación de campos (segunda sección)
    if (!formData.email) {
      formErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Email is invalid.";
      isValid = false;
    }

    if (!formData.username) {
      formErrors.username = "Username is required.";
      isValid = false;
    } else if (formData.username.length < 4) {
      formErrors.username = "Username must be at least 4 characters.";
      isValid = false;
    }

    if (!formData.password) {
      formErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      formErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Lógica para mostrar la segunda sección solo si la primera es válida
  const toggleVisibilidad = () => {
    if (validateFirstSection()) {
      setVisible(false); // Muestra la siguiente sección si la primera es válida
    }
  };

  // Verificación de si el usuario, correo o teléfono ya están registrados
  const checkIfExists = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
        }),
      });

      const data = await response.json();

      if (data.emailExists || data.usernameExists) {
        setRegistrationError({
          message: "The email, username, or phone number is already registered.",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking registration:", error);
      return false;
    }
  };
  
  const navigate = useNavigate();
  const handleSignup = async (event) => {
    event.preventDefault();

    // Primero valida la segunda sección
    if (!validateSecondSection()) {
      return; // Si la segunda sección no es válida, no se realiza el registro
    }

    // Verificar si ya está registrado
    const canRegister = await checkIfExists();
    if (!canRegister) return;

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registro exitoso: " + JSON.stringify(data));
        navigate('/login')
      } else {
        console.log("Error en el registro.");
      }
    } catch (error) {
      console.error("Error en la conexión con el servidor", error);
    }
  };


  const irLogin = () => {
    navigate('/login');
  };

  return (
    <>
      {registrationError && (
        <div className="error-message">
          <p>{registrationError.message}</p>
          <button onClick={irLogin}>Go to Login</button>
        </div>
      )}
      
      <div className={styleLog.containerLog}>
        <div className={styleLog.div_log}>
        <div style={{ justifyContent: "center", textAlign: "center" }}>
          <h2>Signup</h2>
          <hr />
        </div>
        <form onSubmit={handleSignup}>
          <div style={{ display: visible ? "inline-block" : "none" }}>
            <div className="mb-3">
              <label htmlFor="first_name" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className={styleLog.tran_input}
                id="first_name"
                name="nombre"
                placeholder="First Name"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              {errors.nombre && <div className="error">{errors.nombre}</div>}
            </div>
            <hr />
            <div className="mb-3">
              <label htmlFor="last_name" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className={styleLog.tran_input}
                id="last_name"
                name="apellido"
                placeholder="Last Name"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
              {errors.apellido && <div className="error">{errors.apellido}</div>}
            </div>
            <hr />
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                type="text"
                className={styleLog.tran_input}
                id="address"
                name="direccion"
                placeholder="Address"
                value={formData.direccion}
                onChange={handleChange}
                required
              />
              {errors.direccion && <div className="error">{errors.direccion}</div>}
            </div>
            <hr />
            <div className="mb-3">
              <label htmlFor="phone_number" className="form-label">
                Phone Number
              </label>
              <input
                type="number"
                className={styleLog.tran_input}
                id="phone_number"
                name="telefono"
                placeholder="Phone Number"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
              {errors.telefono && <div className="error">{errors.telefono}</div>}
            </div>
            <hr />
            <div className="mb-3">
              <label htmlFor="date_of_birth" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                className={styleLog.tran_input}
                id="date_of_birth"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
              />
              {errors.fechaNacimiento && <div className="error">{errors.fechaNacimiento}</div>}
            </div>
            <hr />
            <div className="mb-3">
              <button onClick={toggleVisibilidad} type="button" className={stylePre.botones}>
                Next
              </button>
            </div>
          </div>

          <div id="datos_login" style={{ display: visible ? "none" : "inline-block" }}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={styleLog.tran_input}
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className={styleLog.tran_input}
                id="username"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errors.username && <div className="error">{errors.username}</div>}
            </div>
            <hr />
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className={styleLog.tran_input}
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
            <hr />
            <button onClick={handleSignup} type="submit" className={stylePre.botones}>
              Submit
            </button>
          </div>
        </form>
        <div className="mb-3" style={{ fontSize: 12, marginTop: 20, textAlign: "center" }}>
          <p onClick={irLogin} style={{ cursor: "pointer" }}>
            You are already signed up, <br /> login
          </p>
        </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
