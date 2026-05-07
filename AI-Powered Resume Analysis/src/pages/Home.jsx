import { useState } from "react"
import UploadResume from "../components/UploadResume"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import jsPDF from "jspdf"

function Home() {

  const [resumeText, setResumeText] = useState("")
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [jobDescription, setJobDescription] = useState("")
  const [jobMatch, setJobMatch] = useState(null)

  // ---------------- ANALYZE RESUME ----------------
  async function handleAnalyze() {

    if (!resumeText) return

    setLoading(true)
    setAnalysis(null)

    try {

      const res = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      })

      const data = await res.json()
      setAnalysis(data)
      const cleanText = resumeText.slice(0, 6000)

    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  // ---------------- JOB MATCH ----------------
  async function handleJobMatch() {

    if (!resumeText || !jobDescription) return

    try {

      const res = await fetch("http://localhost:3000/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      })

      const data = await res.json()
      setJobMatch(data)

    } catch (err) {
      console.log(err)
    }
  }

  // ---------------- PDF ----------------
  function downloadReport() {

    if (!analysis) return

    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.text("Resume AI Report", 20, 20)

    doc.setFontSize(12)
    doc.text(`Name: ${analysis.name || "-"}`, 20, 40)
    doc.text(`Title: ${analysis.title || "-"}`, 20, 50)
    doc.text(`Score: ${analysis.score || 0}/100`, 20, 60)

    doc.save("resume-report.pdf")
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-[#070707] text-white p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent">
          AI Resume Analyzer
        </h1>

        <p className="text-gray-400 mt-2">
          Smart ATS scoring + Job matching system
        </p>
      </div>

      {/* UPLOAD */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
        <UploadResume setResumeText={setResumeText} />
      </div>

     

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">

        {/* LEFT */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-5">

          <div className="flex justify-between mb-3">
            <h2 className="text-xl font-bold">Resume Preview</h2>

            {resumeText && (
              <button
                onClick={handleAnalyze}
                className="bg-purple-600 px-4 py-1 rounded"
              >
                Analyze
              </button>
            )}
          </div>

          <div className="h-[600px] overflow-y-auto text-sm text-gray-300 whitespace-pre-wrap">
            {resumeText || "Upload resume to preview text..."}
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-4">

          {loading && (
            <div className="bg-[#111] p-4 rounded-xl text-purple-400">
              Analyzing resume...
            </div>
          )}

          {analysis && (

            <>
              {/* SCORE */}
              <div className="bg-[#111] p-5 rounded-2xl text-center">

                <div className="w-40 mx-auto">
                  <CircularProgressbar
                    value={analysis.score || 0}
                    text={`${analysis.score || 0}%`}
                    styles={buildStyles({
                      pathColor: "#a855f7",
                      textColor: "#fff",
                      trailColor: "#222"
                    })}
                  />
                </div>

                <button
                  onClick={downloadReport}
                  className="mt-4 bg-white text-black px-4 py-2 rounded cursor-pointer"
                >
                  Download Report
                </button>

              </div>

              {/* SKILLS */}
              <div className="bg-[#111] p-4 rounded-xl">
                <h3 className="font-bold mb-2">Skills</h3>

                <div className="flex flex-wrap gap-2">
                  {(analysis.skills || []).map((s, i) => (
                    <span key={i} className="bg-purple-600/30 px-3 py-1 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* STRENGTHS */}
              <div className="bg-[#111] p-4 rounded-xl">
                <h3 className="text-green-400 font-bold">Strengths</h3>
                {(analysis.strengths || []).map((s, i) => (
                  <p key={i}>• {s}</p>
                ))}
              </div>

              {/* WEAKNESSES */}
              <div className="bg-[#111] p-4 rounded-xl">
                <h3 className="text-red-400 font-bold">Weaknesses</h3>
                {(analysis.weaknesses || []).map((s, i) => (
                  <p key={i}>• {s}</p>
                ))}
              </div>

              {/* SUGGESTIONS */}
              <div className="bg-[#111] p-4 rounded-xl">
                <h3 className="text-blue-400 font-bold">Suggestions</h3>
                {(analysis.suggestions || []).map((s, i) => (
                  <p key={i}>• {s}</p>
                ))}
              </div>

            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default Home