import * as pdfjs from "pdfjs-dist"
import worker from "pdfjs-dist/build/pdf.worker?url"
import mammoth from "mammoth"


pdfjs.GlobalWorkerOptions.workerSrc = worker

export async function parsePDF(file) {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: buffer }).promise

  let text = ""

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const content = await page.getTextContent()

    const pageText = content.items
      .map(item => item.str)
      .join(" ")

    text += pageText + "\n"
  }

  return text
}

export async function parseWord(file) {
  const buffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })

  return result.value
}