const themeStylesheet = document.getElementById("theme-stylesheet");
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
  const isRedTheme = themeStylesheet.getAttribute("href") === "red.css";

  themeStylesheet.setAttribute("href", isRedTheme ? "green.css" : "red.css");
  themeToggle.textContent = isRedTheme
    ? "Zmień motyw na czerwony"
    : "Zmień motyw na zielony";
});
