import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { EditorPage } from "./pages/EditorPage";
import { PreviewPage } from "./pages/PreviewPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/editor/:id" element={<EditorPage />} />
        <Route path="/preview/:id" element={<PreviewPage />} />
        <Route path="/portfolios" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
