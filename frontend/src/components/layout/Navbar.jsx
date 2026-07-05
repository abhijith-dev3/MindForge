import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Games", to: "/games" },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <NavLink to="/" className="w-fit">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <span className="text-xl">🎮</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-cyan-300">MindForge</h1>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Brain training</p>
            </div>
          </div>
        </NavLink>

        <div className="flex flex-wrap items-center gap-2">
          {/* Nav links */}
          <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-cyan-400 text-slate-950"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Only show user info + logout when logged in */}
          {isAuthenticated && (
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-sm text-slate-400 hidden sm:inline">
                {user?.name || user?.email?.split("@")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-rose-500/20 px-3 py-1.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/30"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
