
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import InsightsPage from "./pages/InsightsPage";
import AboutPage from "./pages/AboutPage";
import DeveloperPage from "./pages/DeveloperPage";
import DeveloperLoginPage from "./pages/DeveloperLoginPage";
import DeveloperSignupPage from "./pages/DeveloperSignupPage";
import DeveloperAccountPage from "./pages/DeveloperAccountPage";
import DeveloperReportPage from "./pages/DeveloperReportPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import SupportPage from "./pages/SupportPage";

function NotFoundPage({ isDark }) {
  const navigate = useNavigate();
  const textClass = isDark ? "text-white" : "text-gray-900";
  const mutedClass = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-16 text-center">
      <div className="max-w-lg">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">404 · Page not found</p>
        <h1 className={`text-3xl font-bold ${textClass}`}>We couldn’t find that page.</h1>
        <p className={`mt-3 ${mutedClass}`}>The address may have changed, or the page may no longer be available.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
            className={`rounded-md border px-4 py-2 text-sm font-medium ${isDark ? "border-slate-600 text-gray-200 hover:bg-slate-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
          >
            Go back
          </button>
          <Link to="/" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Go to home
          </Link>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      // Check system preference - default to light
      setIsDark(false);
    }
  }, []);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const bgClass = isDark 
    ? "bg-slate-900"
    : "bg-white";

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${bgClass}`}>
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        <main className="min-h-[calc(100vh-64px)]">
          <Routes>
            <Route path="/" element={<HomePage isDark={isDark} />} />
            <Route path="/search" element={<SearchResultsPage isDark={isDark} />} />
            <Route path="/insights" element={<InsightsPage isDark={isDark} />} />
            <Route path="/about" element={<AboutPage isDark={isDark} />} />
            <Route path="/developers" element={<DeveloperPage isDark={isDark} />} />
            <Route path="/docs" element={<DeveloperPage isDark={isDark} />} />
            <Route path="/developers/login" element={<DeveloperLoginPage isDark={isDark} />} />
            <Route path="/developers/signup" element={<DeveloperSignupPage isDark={isDark} />} />
            <Route path="/developers/account" element={<DeveloperAccountPage isDark={isDark} />} />
            <Route path="/developers/reports/:reportId" element={<DeveloperReportPage isDark={isDark} />} />
            <Route path="/privacy" element={<PrivacyPage isDark={isDark} />} />
            <Route path="/terms" element={<TermsPage isDark={isDark} />} />
            <Route path="/disclaimer" element={<DisclaimerPage isDark={isDark} />} />
            <Route path="/contact" element={<ContactPage isDark={isDark} />} />
            <Route path="/faq" element={<FAQPage isDark={isDark} />} />
            <Route path="/support" element={<SupportPage isDark={isDark} />} />
            <Route path="*" element={<NotFoundPage isDark={isDark} />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className={`border-t transition-colors py-12 ${isDark ? "border-slate-700 bg-slate-900/50 backdrop-blur-md" : "border-gray-200 bg-white"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className={`font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Product</h3>
                <ul className={`space-y-2 text-sm ${isDark ? "text-gray-400" : "text-gray-700"}`}>
                  <li><Link to="/" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Features</Link></li>
                  <li><Link to="/developers" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Developer Docs</Link></li>
                  <li><Link to="/developers#pricing" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>API Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h3 className={`font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Company</h3>
                <ul className={`space-y-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  <li><Link to="/about" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>About</Link></li>
                  <li><Link to="/contact" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Contact</Link></li>
                  <li><Link to="/support" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Support</Link></li>
                </ul>
              </div>
              <div>
                <h3 className={`font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Legal</h3>
                <ul className={`space-y-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  <li><Link to="/privacy" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Privacy</Link></li>
                  <li><Link to="/terms" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Terms</Link></li>
                  <li><Link to="/disclaimer" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Disclaimer</Link></li>
                </ul>
              </div>
              <div>
                <h3 className={`font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Resources</h3>
                <ul className={`space-y-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  <li><Link to="/developers" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Developers</Link></li>
                  <li><Link to="/support" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Support</Link></li>
                  <li><Link to="/faq" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>FAQ</Link></li>
                </ul>
              </div>
            </div>
            
            <div className={`border-t pt-8 ${isDark ? "border-slate-700" : "border-gray-200"}`}>
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  © 2026 FraudCheckr. All rights reserved.
                </p>
                <p className={`text-xs mt-4 md:mt-0 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                  Providing transparent access to public fraud conviction records from Nigeria's federal courts
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
