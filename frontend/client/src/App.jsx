import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import RankingPage from "./pages/RankingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<RankingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*"       element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
