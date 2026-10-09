import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { LoginPage } from "./pages/LoginPage";
import { PublicProfilePage } from "./pages/PublicProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tarou" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/:username" element={<PublicProfilePage />} />
    </Routes>
  );
}

export default App;
