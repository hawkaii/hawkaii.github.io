// Force dark theme always
const currentTheme = "dark"
document.documentElement.setAttribute("saved-theme", currentTheme)

const emitThemeChangeEvent = (theme: "light" | "dark") => {
  document.body.classList.add("animation-ready")
  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

document.addEventListener("nav", () => {
  // No theme switching — always dark
  emitThemeChangeEvent("dark")
})
