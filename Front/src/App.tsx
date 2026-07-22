import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from "./components/Header/Header";
import HeaderUser from "./components/HeaderUser/HeaderUser";
import ClienteRoute from "./components/ProtectedRoute/ClienteRoute";
import TecnicoRoute from "./components/ProtectedRoute/TecnicoRoute";

// Rotas públicas
import Home from "./pages/SemLogin/Home/Home";
import Suporte from "./pages/SemLogin/Suporte/Suporte";
import Sobre from "./pages/SemLogin/Sobre/Sobre";
import Como from "./pages/SemLogin/Como/Como";

// Login/cadastro
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";

// Rotas privadas
import HomeLogin from "./pages/ComLogin/Dashboard/Dashboard";
import AbrirChamado from "./pages/ComLogin/AbrirChamado/AbrirChamado";
import Chamado from "./pages/ComLogin/Chamados/Chamados";
import Detalhes from "./pages/ComLogin/Detalhes/Detalhes";

// Técnico
import DashboardTecnico from "./pages/Tecnico/DashboardTecnico/DashboardTecnico";
import ChamadosTecnico from "./pages/Tecnico/ChamadosTecnico/ChamadosTecnico";
import DetalhesTecnico from "./pages/Tecnico/DetalhesTecnico/DetalhesTecnico";

function App() {
  const usuarioSalvo = localStorage.getItem("usuario");

  const [usuario, setUsuario] = useState(
    usuarioSalvo ? JSON.parse(usuarioSalvo) : null,
  );

  useEffect(() => {
    function atualizarLogin() {
      const usuarioSalvo = localStorage.getItem("usuario");

      setUsuario(usuarioSalvo ? JSON.parse(usuarioSalvo) : null);
    }

    window.addEventListener("login", atualizarLogin);

    return () => {
      window.removeEventListener("login", atualizarLogin);
    };
  }, []);

  return (
    <BrowserRouter>
      {usuario ? <HeaderUser usuario={usuario} /> : <Header />}

      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/suporte" element={<Suporte />} />
        <Route path="/como" element={<Como />} />
        <Route path="/sobre" element={<Sobre />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Usuário */}
        <Route
          path="/dashboard"
          element={
            <ClienteRoute>
              <HomeLogin />
            </ClienteRoute>
          }
        />

        <Route
          path="/abrir-chamado"
          element={
            <ClienteRoute>
              <AbrirChamado />
            </ClienteRoute>
          }
        />

        <Route
          path="/chamados"
          element={
            <ClienteRoute>
              <Chamado />
            </ClienteRoute>
          }
        />
        <Route path="/detalhes/:id" element={<Detalhes />} />

        {/* Técnico */}
        <Route
          path="/dashboard-tecnico"
          element={
            <TecnicoRoute>
              <DashboardTecnico />
            </TecnicoRoute>
          }
        />

        <Route
          path="/ChamadosTecnico"
          element={
            <TecnicoRoute>
              <ChamadosTecnico />
            </TecnicoRoute>
          }
        />

        <Route
          path="/tecnico/chamados/:id"
          element={
            <TecnicoRoute>
              <DetalhesTecnico />
            </TecnicoRoute>
          }
        />

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
