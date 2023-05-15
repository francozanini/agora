export function cn(...classes: (string | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function systemTheme(): "dark" | "light" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
