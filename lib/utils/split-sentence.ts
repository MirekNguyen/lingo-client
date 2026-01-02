/**
 * Splits a sentence into parts around the target word (case-insensitive).
 * Returns an array of parts where the middle element should be replaced with the input.
 *
 * @param sentence - The full sentence
 * @param targetWord - The word to find and replace
 * @returns Array of sentence parts [before, target, after]
 */
export function splitSentence(sentence: string, targetWord: string): [string, string, string] {
  // Normalize for case-insensitive search
  const lowerSentence = sentence.toLowerCase()
  const lowerTarget = targetWord.toLowerCase()

  const wordBoundaryRegex = new RegExp(`\\b${lowerTarget.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i")
  const match = sentence.match(wordBoundaryRegex)

  if (match && match.index !== undefined) {
    const before = sentence.slice(0, match.index)
    const target = sentence.slice(match.index, match.index + match[0].length)
    const after = sentence.slice(match.index + match[0].length)
    return [before, target, after]
  }

  const index = lowerSentence.indexOf(lowerTarget)

  if (index === -1) {
    // If not found, return empty parts so no highlighting occurs
    return ["", "", sentence]
  }

  const before = sentence.slice(0, index)
  const target = sentence.slice(index, index + targetWord.length)
  const after = sentence.slice(index + targetWord.length)

  return [before, target, after]
}
