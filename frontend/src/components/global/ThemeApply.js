export function themeApply() {
    let darkMode = localStorage.getItem("darkMode")
    if (darkMode === 'enabled') {
        document.body.classList.add("darkmode")
    } else {
        document.body.classList.remove("darkmode")
    }
}
