import { useState } from "react"
import UploadResume from "../components/UploadResume"

function JobMatch() {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [jobMatch, setJobMatch] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleJobMatch() {
    if (!resumeText || !jobDescription) return

    setLoading(true)
    setJobMatch(null)

    try {
      const res = await fetch("http://localhost:3000/job-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
        }),
      })

      const data = await res.json()

      console.log("JOB MATCH:", data)

      setJobMatch(data)
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-10 py-6">

      {/* TOP SECTION */}
      <div className="mb-8">

        <h1 className="text-3xl sm:text-4xl font-bold">
          Job Matching AI
        </h1>

        <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-2xl">
          Upload your resume and compare it against any job description
          to check ATS compatibility and missing skills instantly.
        </p>

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* UPLOAD CARD */}
          <div className="bg-[#111111] border border-[#222] rounded-3xl p-4 sm:p-6 shadow-2xl">

            <div className="flex items-center justify-between flex-wrap gap-3 mb-5">

              <div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  Upload Resume
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  PDF and DOCX supported
                </p>
              </div>

              {resumeText && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-xl text-sm">
                  Resume Ready
                </div>
              )}

            </div>

            <UploadResume setResumeText={setResumeText} />

          </div>

          {/* JOB DESCRIPTION */}
          <div className="bg-[#111111] border border-[#222] rounded-3xl p-4 sm:p-6 shadow-2xl">

            <div className="mb-4">

              <h2 className="text-xl sm:text-2xl font-bold">
                Job Description
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Paste the employer's job requirements below
              </p>

            </div>

            <textarea
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-[220px] sm:h-[300px] bg-black border border-[#333] rounded-2xl p-4 outline-none resize-none text-sm sm:text-base focus:border-purple-500 transition"
            />

            <button
              onClick={handleJobMatch}
              className="w-full mt-5 bg-purple-600 hover:bg-purple-700 transition-all duration-300 rounded-2xl py-3 font-semibold text-sm sm:text-base shadow-[0_0_25px_rgba(168,85,247,0.35)]"
            >
              Match Resume
            </button>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div>

          {/* LOADING */}
          {loading && (
            <div className="bg-[#111111] border border-[#222] rounded-3xl p-6">

              <div className="flex items-center gap-3">

                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>

                <p className="text-purple-400">
                  AI is matching your resume...
                </p>

              </div>

            </div>
          )}

          {/* RESULTS */}
          {jobMatch && (
            <div className="space-y-6">

              {/* SCORE */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-6 shadow-2xl">

                <p className="text-sm uppercase tracking-widest text-purple-200">
                  Match Score
                </p>

                <h2 className="text-5xl sm:text-6xl font-bold mt-3">
                  {jobMatch.matchScore}%
                </h2>

                <p className="text-purple-200 mt-3 text-sm sm:text-base">
                  AI compatibility score between your resume and the job role.
                </p>

              </div>

              {/* MATCHED SKILLS */}
              <div className="bg-[#111111] border border-green-500/20 rounded-3xl p-5 sm:p-6">

                <h3 className="text-xl font-bold text-green-400 mb-4">
                  Matched Skills
                </h3>

                <div className="flex flex-wrap gap-3">

                  {jobMatch.matchedSkills?.length > 0 ? (
                    jobMatch.matchedSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-green-500/10 border border-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400">
                      No matched skills found
                    </p>
                  )}

                </div>

              </div>

              {/* MISSING SKILLS */}
              <div className="bg-[#111111] border border-red-500/20 rounded-3xl p-5 sm:p-6">

                <h3 className="text-xl font-bold text-red-400 mb-4">
                  Missing Skills
                </h3>

                <div className="flex flex-wrap gap-3">

                  {jobMatch.missingSkills?.length > 0 ? (
                    jobMatch.missingSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400">
                      No missing skills detected
                    </p>
                  )}

                </div>

              </div>

              {/* SUMMARY */}
              <div className="bg-[#111111] border border-blue-500/20 rounded-3xl p-5 sm:p-6">

                <h3 className="text-xl font-bold text-blue-400 mb-4">
                  AI Recommendation
                </h3>

                <p className="text-gray-300 leading-8 text-sm sm:text-base">
                  {jobMatch.summary}
                </p>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default JobMatch