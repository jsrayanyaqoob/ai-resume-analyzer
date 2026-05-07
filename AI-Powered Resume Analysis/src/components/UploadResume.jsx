import { useState } from "react"
import { parsePDF, parseWord } from "../services/parserService"
import { cleanResumeText } from "../utils/cleanText"
import { formatResumeText } from "../utils/formatResume"

function UploadResume({ setResumeText }) {
  const [fileName, setFileName] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleFile(e) {
  const file = e.target.files[0]
  if (!file) return

  console.log("FILE:", file.name)

  setFileName(file.name)
  setLoading(true)

  let text = ""

  try {
    if (file.name.endsWith(".pdf")) {
      console.log("Parsing PDF...")
      text = await parsePDF(file)
    } 
    else if (file.name.endsWith(".docx")) {
      console.log("Parsing DOCX...")
      text = await parseWord(file)
    } 
    else {
      alert("Only PDF or DOCX allowed")
      setLoading(false)
      return
    }

    console.log("RAW TEXT:", text)

    const cleaned = cleanResumeText(text)

    console.log("CLEANED TEXT:", cleaned)

    setResumeText(formatResumeText(cleaned))

  } catch (err) {
    console.log("ERROR:", err)
  }

  setLoading(false)
}

  return (
    <div className="bg-gray-900 p-6 rounded">
      <input type="file" onChange={handleFile} />

      {fileName && (
        <p className="text-sm text-gray-400 mt-2">
          {fileName}
        </p>
      )}

      {loading && (
        <p className="text-purple-400 mt-2">
          Reading file...
        </p>
      )}
    </div>
  )
}

export default UploadResume