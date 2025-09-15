export default function Navbar({ role, onLogout }) {
  const handleLogout = () => {
    // Clear JWT tokens and role
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");

    // Call parent logout handler
    onLogout();
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">Trainee Mini Project Tracker</h1>
      <div className="flex items-center gap-4">
        <span className="capitalize">{role}</span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
