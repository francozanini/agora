export function capitalized(text: string) {
  if (!text[0]) return "";
  return text[0].toUpperCase() + text.slice(1);
}
