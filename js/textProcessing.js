// textProcessing.js

/**
 * Converts URLs in the text to clickable links.
 * @param {string} text The text containing URLs enclosed in [url] and [/url].
 * @return {string} The text with URLs converted to anchor tags.
 */
function convertUrlsToLinks(text){
  text = text.replace(/\[url\]/g, "").replace(/\[\/url\]/g, "");
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, url => `<a href="${url}" target="_blank">${url}</a>`);
}

/**
 * Converts pseudo-bold tags [b]...[/b] to HTML bold tags.
 * @param {string} text The text containing pseudo-bold tags.
 * @return {string} The text with pseudo-bold tags converted to <b> tags.
 */
function convertPseudoBoldToBold(text) {
  return text.replace(/\[b\]/g, "<b>").replace(/\[\/b\]/g, "</b>");
}

/**
 * Converts newline characters to HTML break line tags.
 * @param {string} text The text containing newline characters.
 * @return {string} The text with newline characters converted to <br> tags.
 */
function convertNewLinesToBreaks(text) {
  return text.replace(/\n/g, "<br>");
}

/**
 * Processes text by converting URLs to links, pseudo-bold tags to HTML bold tags, and newlines to breaks.
 * @param {string} text The text to be processed.
 * @return {string} The processed text.
 */
function processText(text) {
  let processedText = text;
  processedText = convertUrlsToLinks(processedText);
  processedText = convertPseudoBoldToBold(processedText);
  processedText = convertNewLinesToBreaks(processedText); // Ensure new lines are converted
  return processedText;
}

// Export the functions or the main processing function, depending on your setup
export { processText };
