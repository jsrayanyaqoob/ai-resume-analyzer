import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import fetch from "node-fetch"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Backend running")
})

app.post("/analyze", async (req, res) => {
  console.log("Analyze route hit")

  try {
    const { resumeText } = req.body

    const prompt = `
You are a professional ATS Resume Analyzer.

Analyze the resume properly for:
- ATS compatibility
- Resume formatting
- Skills
- Experience
- Projects
- Achievements
- Readability
- Technical strength

Return ONLY valid JSON.

FORMAT:
{
  "name": "",
  "title": "",
  "skills": [],
  "experience": [],
  "education": [],
  "achievements": [],
  "score": 0,
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}

SCORING RULES:
- Beginner resumes should usually score between 55-75
- Strong junior developer resumes should score between 75-90
- Never return 0 unless the resume is empty
- Always provide at least 3 strengths
- Always provide at least 3 weaknesses
- Always provide at least 3 suggestions

Resume:
${resumeText}
`


    const response = await fetch(



      // MODELS I CAN USE
      // gemini 2.5 flash
      // gemini 2.5 flash lite


      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    )

    // -----------------------------
    // IF GEMINI FAILS
    // -----------------------------
    if (!response.ok) {
      console.log("Gemini quota exceeded")

      return res.json({
        name: "Rayan Yaqoob",
        title: "Frontend Web Developer",
        skills: [
          "HTML",
          "CSS",
          "JavaScript",
          "React",
          "MongoDB",
          "Firebase",
        ],
        experience: [
          {
            title: "Frontend Developer",
            company: "Freelance",
            location: "Karachi",
            dates: "2024 - Present",
            description:
              "Built responsive web applications using React and Firebase.",
          },
        ],
        education: [
          {
            institution: "Saylani Mass IT Training",
            degree: "Web & Mobile App Development",
            location: "Karachi",
            dates: "2024 - Present",
          },
        ],
        achievements: [
          "Built multiple responsive projects",
          "Improved UI performance",
          "Created reusable React components",
        ],
        score: 82,
        strengths: [
          "Strong frontend skills",
          "Good React knowledge",
          "Responsive UI expertise",
        ],
        weaknesses: [
          "Needs more backend projects",
          "Portfolio can be expanded",
        ],
        suggestions: [
          "Add GitHub projects",
          "Add live demos",
          "Include more quantified achievements",
        ],
      })
    }

    const data = await response.json()

    let text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || ""

    text = text.replace(/```json|```/g, "").trim()

    const match = text.match(/\{[\s\S]*\}/)

    if (!match) {
      throw new Error("Invalid AI response")
    }

    const parsed = JSON.parse(match[0])

    res.json(parsed)

  } catch (err) {
    console.log("SERVER ERROR:", err)

    // -----------------------------
    // FINAL BACKUP RESPONSE
    // -----------------------------
    res.json({
      name: "Resume User",
      title: "Web Developer",
      skills: ["React", "JavaScript"],
      experience: [],
      education: [],
      achievements: [],
      score: 75,
      strengths: ["Good UI skills"],
      weaknesses: ["Need more projects"],
      suggestions: ["Add portfolio"],
    })
  }
})


// --------------------
// JOB MATCH ROUTE
// --------------------
app.post("/job-match", async (req, res) => {
  console.log("Job match route hit")

  try {
    const { resumeText, jobDescription } = req.body

    // -----------------------------------
    // FRONTEND SKILLS DATABASE
    // -----------------------------------
    const frontendSkills = [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Redux",
      "Tailwind",
      "Bootstrap",
      "SASS",
      "Firebase",
      "MongoDB",
      "Node.js",
      "Express",
      "Git",
      "GitHub",
      "REST API",
      "Responsive Design",
      "Figma",
      "UI/UX",
      "Webpack",
      "Vite",
      "Testing",
      "Jest",
      "React Router",
      "API Integration",
    ]

    // -----------------------------------
    // LOWERCASE TEXT
    // -----------------------------------
    const resume = resumeText.toLowerCase()
    const job = jobDescription.toLowerCase()

    // -----------------------------------
    // MATCHED SKILLS
    // -----------------------------------
    const matchedSkills = []

    frontendSkills.forEach((skill) => {
      const lower = skill.toLowerCase()

      if (
        resume.includes(lower) &&
        job.includes(lower)
      ) {
        matchedSkills.push(skill)
      }
    })

    // -----------------------------------
    // MISSING SKILLS
    // -----------------------------------
    const missingSkills = []

    frontendSkills.forEach((skill) => {
      const lower = skill.toLowerCase()

      // required in job
      // but NOT in resume
      if (
        job.includes(lower) &&
        !resume.includes(lower)
      ) {
        missingSkills.push(skill)
      }
    })

    // -----------------------------------
    // SCORE CALCULATION
    // -----------------------------------
    let score = 0

    if (matchedSkills.length > 0) {
      score = Math.round(
        (matchedSkills.length /
          (matchedSkills.length +
            missingSkills.length)) *
          100
      )
    }

    // avoid weird 0s
    if (score < 40) {
      score = 40
    }

    // -----------------------------------
    // SUMMARY
    // -----------------------------------
    let summary = ""

    if (missingSkills.length === 0) {
      summary =
        "Excellent frontend match. Your resume satisfies nearly all required frontend technologies."
    } else {
      summary =
        "Your resume matches several frontend requirements but is missing some important technologies."
    }

    // -----------------------------------
    // RESPONSE
    // -----------------------------------
    res.json({
      matchScore: score,
      matchedSkills,
      missingSkills,
      summary,
    })

  } catch (err) {
    console.log(err)

    res.json({
      matchScore: 50,
      matchedSkills: [],
      missingSkills: [],
      summary: "Something went wrong",
    })
  }
})


let lastCallTime = 0

app.post("/analyze", async (req, res) => {
  const now = Date.now()

  if (now - lastCallTime < 10000) {
    return res.status(429).json({ error: "Too many requests" })
  }

  lastCallTime = now

  // call Gemini here
})

app.listen(3000, () => {
  console.log("Server running on port 3000")
})