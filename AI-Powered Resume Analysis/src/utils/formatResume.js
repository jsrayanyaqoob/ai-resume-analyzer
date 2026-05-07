export function formatResumeText(text) {
  return text
    .replace(/\s{2,}/g, "\n")
    .replace(/Skills/i, "\n\nSKILLS\n")
    .replace(/Experience/i, "\n\nEXPERIENCE\n")
    .replace(/Education/i, "\n\nEDUCATION\n")
    .replace(/Key Achievements/i, "\n\nACHIEVEMENTS\n")
    .replace(/Interests/i, "\n\nINTERESTS\n")
}