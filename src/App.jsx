
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import Presentacion from "./components/presentacion.jsx";
import Login from "./components/login.jsx";
import Signup from "./components/signup.jsx";
import Menu from "./components/main.jsx";
import ReservaUsuario from "./components/reservasUsuario.jsx";


function App() {
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');
    return token ? children : <Navigate to="/login" />;
  };
  const ProtectedMain = ({ children }) =>{
    const token = localStorage.getItem('authToken');
    return token ? <Navigate to= "/main"/>: children;
  }
 
  const ProtectedPresentacion = ({children}) => {
    const token = localStorage.getItem('authToken');
    return token ? <Navigate to= "/main"/>: children;
  }

  return (
    <>
     <div>
      <Router>
        <Routes>
          <Route path="/" element={<Presentacion />} />
          <Route 
          path="/login" 
          element={<ProtectedMain>
            <Login></Login>
          </ProtectedMain>} />
          <Route path="/signup" element={<Signup />}/>
          <Route 
            path="/main" element={
            <ProtectedRoute>
              <Menu/>
            </ProtectedRoute>
          }/>
          
        </Routes>
      </Router>
    </div>
    </>
  )
}

export default App
