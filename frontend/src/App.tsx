import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { PublicProfilePage } from "./pages/PublicProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tarou" replace />} />
      <Route path="/me" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/:username" element={<PublicProfilePage />} />
    </Routes>
  );
}

export default App;
