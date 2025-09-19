/**
 * Highlights "Aramid" text in token names to improve readability when logos are similar
 * @param text The token name to process
 * @returns Object with highlighted flag and processed text/HTML
 */
export const highlightAramidText = (text: string) => {
  const hasAramid = text.toLowerCase().includes('aramid')

  if (!hasAramid) {
    return {
      hasAramid: false,
      text: text,
      html: text
    }
  }

  // Case-insensitive replacement while preserving original case
  const highlightedHtml = text.replace(/aramid/gi, '<span class="aramid-highlight">$&</span>')

  return {
    hasAramid: true,
    text: text,
    html: highlightedHtml
  }
}
