// ============================================
// App.js  (Root Component)
// → Hanya berisi routing antar halaman
// → Route /        → LandingPage
// → Route /login   → LoginPage
// → Route /admin   → AdminPage
// → Route /orders  → OrderHistory
// ============================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./components/LoginPage";
import OrderHistory from "./pages/OrderHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
