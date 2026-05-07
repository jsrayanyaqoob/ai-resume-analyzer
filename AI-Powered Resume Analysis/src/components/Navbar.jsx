import { Link, useLocation } from "react-router-dom"
import { useState } from "react"

function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/90 border-b border-white/10">

      <div className="max-w-7xl mx-auto px-4 md:px-6 h-[75px] flex items-center justify-between">

        {/* LOGO */}
        <Link to="/">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.5)]">

              <span className="text-white font-bold">
                AI
              </span>

            </div>

            <div>
              <h1 className="text-white font-bold text-lg leading-none">
                Resume Analyzer
              </h1>

              <p className="text-xs text-gray-400 mt-1 hidden sm:block">
                AI Powered ATS System
              </p>
            </div>

          </div>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-3">

          <Link
            to="/"
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              location.pathname === "/"
                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.45)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Resume Analyzer
          </Link>

          <Link
            to="/job-match"
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              location.pathname === "/job-match"
                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.45)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Job Match AI
          </Link>

        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-3xl"
        >
          ☰
        </button>

      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">

          <div className="bg-[#111111] border border-[#222] rounded-2xl p-3 flex flex-col gap-2">

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm transition ${
                location.pathname === "/"
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              Resume Analyzer
            </Link>

            <Link
              to="/job-match"
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm transition ${
                location.pathname === "/job-match"
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              Job Match AI
            </Link>

          </div>

        </div>
      )}
    </nav>
  )
}

export default Navbar