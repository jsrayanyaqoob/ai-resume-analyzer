import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import JobMatch from "./pages/JobMatch"
import Navbar from "./components/Navbar"

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/job-match" element={<JobMatch />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App