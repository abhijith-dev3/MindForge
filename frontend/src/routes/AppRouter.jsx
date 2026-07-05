import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Games from "../pages/Games";
import ReactionTest from "../components/games/ReactionTest/ReactionTest";
import MemoryGame from "../components/games/MemoryGame/MemoryGame";
import AccuracyGame from "../components/games/AccuracyGame/AccuracyGame";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { useAuth } from "../context/AuthContext";


function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function AppRouter() {
  return (
    <Routes>
      
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

   
      <Route path="/" element={<Layout />}>

      
        <Route index element={<Home />} />

   
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="games" element={<Games />} />
          <Route path="reaction" element={<ReactionTest />} />
          <Route path="memory" element={<MemoryGame />} />
          <Route path="accuracy" element={<AccuracyGame />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
