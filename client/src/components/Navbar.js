import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Home, BarChart3, Sun, Moon } from "lucide-react";

const accents = [
  { key: "blue", label: "Blue" },
  { key: "violet", label: "Violet" },
  { key: "emerald", label: "Emerald" },
  { key: "rose", label: "Rose" },
  { key: "amber", label: "Amber" },
];

const Navbar = () => {
  const location = useLocation();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [accent, setAccent] = useState(
    () => localStorage.getItem("accent") || "blue"
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-accent", accent);
    localStorage.setItem("theme", theme);
    localStorage.setItem("accent", accent);
  }, [theme, accent]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-surface shadow-sm border-b border-surface">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--primary-600)" }}
            >
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-semibold text-base-color">
              FormBuilder
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Accent picker */}
            <select
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className="input-field w-32"
              title="Accent color"
            >
              {accents.map((a) => (
                <option key={a.key} value={a.key}>
                  {a.label}
                </option>
              ))}
            </select>

            {/* Theme toggle */}
            <button
              onClick={() =>
                setTheme((t) => (t === "light" ? "dark" : "light"))
              }
              className="btn-secondary flex items-center space-x-2"
              title="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              <span className="hidden sm:inline">
                {theme === "light" ? "Dark" : "Light"}
              </span>
            </button>

            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-accent-50 text-accent-700"
                  : "text-base-color opacity-80 hover:opacity-100 hover-accent-50"
              }`}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/builder"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive("/builder")
                  ? "bg-accent-50 text-accent-700"
                  : "text-base-color opacity-80 hover:opacity-100 hover-accent-50"
              }`}
            >
              <Plus size={20} />
              <span>Create Form</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
