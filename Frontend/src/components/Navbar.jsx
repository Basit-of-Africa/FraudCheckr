
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";

const Navbar = ({ isDark, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/search?name=", label: "Search" },
    { to: "/insights", label: "Insights" },
    { to: "/about", label: "About" },
    { to: "/developers", label: "Developers" },
  ];

  const linkClass = `text-sm font-medium transition-colors duration-200 ${
    isDark ? "hover:text-white" : "hover:text-gray-900"
  }`;

  return (
    <nav className={`sticky top-0 z-50 border-b transition-colors duration-200 ${isDark ? "bg-slate-950/80 border-slate-800/50 backdrop-blur-xl" : "bg-white/80 border-gray-200/50 backdrop-blur-xl"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded bg-blue-600 flex items-center justify-center font-bold text-white group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-200">
              F
            </div>
            <span className={`font-semibold text-base tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
              FraudCheckr
            </span>
          </Link>

          {/* Navigation Links */}
          <div className={`hidden md:flex items-center gap-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${isDark ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-200 ${isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-gray-100 hover:bg-gray-200"}`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600" />
              )}
            </button>

            <Link
              to="/search?name="
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Search
            </Link>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden py-4 border-t ${isDark ? "border-slate-800/60" : "border-gray-200/70"}`}>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isDark
                      ? "text-gray-200 hover:bg-slate-800 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                to="/search?name="
                className="mt-2 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
