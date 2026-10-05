import { Navigate, Route, Routes } from "react-router-dom";
import { PublicProfilePage } from "./pages/PublicProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tarou" replace />} />
      <Route path="/:username" element={<PublicProfilePage />} />
    </Routes>
  );
}

export default App;
