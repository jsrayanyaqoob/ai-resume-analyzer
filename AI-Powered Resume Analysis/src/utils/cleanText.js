export function cleanResumeText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .replace(/•/g, "-")
    .replace(/[^\x00-\x7F]/g, "")
    .trim()
}