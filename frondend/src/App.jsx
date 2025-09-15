import { useState } from "react";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ProjectList from "./components/ProjectList";


function App() {
  const [token, setToken] = useState(localStorage.getItem("access") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || "trainee");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    setToken(null);
  };

  if (!token) return <Login onLogin={setToken} />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar role={role} onLogout={handleLogout} />
      <main className="p-4">
        <ProjectList role={role} />
      </main>
    </div>
  );
}

export default App;
