import { useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Menu from "./Menu";
import About from "./About";
import Contact from "./Contact";
import AdminPanel from "./AdminPanel";
import "./App.css";

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div>
      <Navbar onAdminClick={() => setShowAdmin(true)} />
      <Hero />
      <Menu />
      <About />
      <Contact />
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}

export default App;
