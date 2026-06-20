import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { RequireAuth } from "./components/RequireAuth";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Repositories from "./pages/Repositories";
import DeveloperTwin from "./pages/DeveloperTwin";
import AskFormer from "./pages/AskFormer";
import KnowledgeMap from "./pages/KnowledgeMap";
import RiskScore from "./pages/RiskScore";
import Analytics from "./pages/Analytics";
import SearchPage from "./pages/Search";
import Documentation from "./pages/Documentation";
import Architecture from "./pages/Architecture";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import DatabasePage from "./pages/DatabaseArchitecture";

function Protected({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/app"
          element={
            <Protected>
              <Layout />
            </Protected>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="repositories" element={<Repositories />} />
          <Route path="twin" element={<DeveloperTwin />} />
          <Route path="ask" element={<AskFormer />} />
          <Route path="knowledge-map" element={<KnowledgeMap />} />
          <Route path="risk" element={<RiskScore />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="docs" element={<Documentation />} />
          <Route path="architecture" element={<Architecture />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="database" element={<DatabasePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
