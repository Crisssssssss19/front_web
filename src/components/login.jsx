import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styleLog from "../css/login.module.css";
import stylePre from "../css/presentacion.module.css";
import apiClient from '../appCliente';


function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(""); // Para manejar el error de login
  const navigate = useNavigate();

  const usernameRef = useRef(null); // Referencia al campo username

  const irSignup = () => {
    navigate("/signup");
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Validar usuario
    if (!username) {
      formErrors.username = "Username is required.";
      isValid = false;
      usernameRef.current.focus(); // Focaliza el campo username si hay error
    }

    // Validar contraseña
    if (!password) {
      formErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const checkUsernameExists = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/check-username/${username}`
      );
      if (!response.ok) {
        throw new Error("Username does not exist.");
      }
      return true; // El nombre de usuario existe en la base de datos
    } catch (error) {
      return false; // El nombre de usuario no existe en la base de datos
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Verificar si el nombre de usuario existe en la base de datos
    const usernameExists = await checkUsernameExists(username);

    if (!usernameExists) {
      setLoginError("Username does not exist. Please sign up.");
      return; // Detener el flujo si el usuario no existe
    }
  
    try {
      const response = await apiClient.post('http://localhost:8080/api/auth/login', { username, password });
      
      localStorage.setItem('authToken', response.data.token); // Guardamos el token
      localStorage.setItem('idUser',response.data.id);
      console.log(response.data);
      console.log(response.data.id);
      navigate('/main');// Redirigimos al dashboard
    } catch (error) {
      alert('Invalid credentials');
    }

    /*try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        // Guardar el token en el localStorage
        localStorage.setItem("token", token);
        console.log("toke:", token);

        console.log("Login exitoso");
        // Redirigir a la página principal o dashboard
        // Ajusta la ruta según sea necesario
      } else {
        console.error("Error de autenticación");
        setLoginError("Incorrect username or password.");
      }
    } catch (error) {
      console.error("Error en la conexión con el servidor", error);
    }*/
  };

  return (
    <div className={styleLog.containerLog}>
      <div className={styleLog.div_log}>
        <div>
          <h2 style={{ textAlign: "center" }}>Login</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" >
              User name
            </label>
            <input
              type="text"
              className={styleLog.tran_input} 
              id="username"
              ref={usernameRef} // Asigna la referencia al input de username
              placeholder="Username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            {errors.username && (
              <span className={styleLog.error}>{errors.username}</span>
            )}
          </div>
          <hr />
          <div>
            <label htmlFor="password">
              Password
            </label>
            <input
              type="password"
              className={styleLog.tran_input}
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <span className={styleLog.error}>{errors.password}</span>
            )}
          </div>
          <hr />
          <button type="submit" className={stylePre.botones}>
            Submit
          </button>

          {loginError && (
            <div
              className="error-message"
              style={{ fontSize: 12, marginTop: 20, textAlign: "center" }}
            >
              <p>{loginError}</p>
              <p>
                Don't have an account?{" "}
                <span
                  onClick={irSignup}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  Sign up here
                </span>
                .
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
