import { Routes, Route, Navigate } from "react-router-dom";
import Form from "./Form/Form.jsx";
import { RescheduleForm } from "./Form/RescheduleForm.jsx";
import Dashboard from "./dashboard/Dashboard.jsx";
import Home from "./Home/Home.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";

// Componente para rutas privadas
const PrivateRoute = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>; // Puedes mostrar un loading hasta verificar el login
  }

  return isAuthenticated ? element : <Navigate to="/" />; // Redirige al home si no está autenticado
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/appointment-form" element={<Form />} />
      <Route path="/reschedule-form" element={<RescheduleForm />} />
      <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
    </Routes>
  );
}

export default App;
