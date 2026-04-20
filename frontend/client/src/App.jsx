import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import RankingPage from "./pages/RankingPage";
import RecommendationPage from "./pages/RecommendationPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ranking_page"       element={<RankingPage />} />
        <Route path="/"       element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*"       element={<Navigate to="/" replace />} />
        <Route path="/recommendations" element={<RecommendationPage />} />

      </Routes>
    </BrowserRouter>
  );
}
