export async function analyzeResume(resumeText) {
  const res = await fetch("http://localhost:3000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resumeText }),
  })

  const data = await res.json()
  return data
}