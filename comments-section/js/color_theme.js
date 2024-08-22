// ---------- For toggling btn day & night mode + prefers-color-scheme on load ---------- //
function toggleTheme() {
    document.getElementById("toggle").addEventListener("click", () => { //Have to target the input not label
        document.getElementsByTagName('body')[0].classList.toggle("light-theme");
    });
}

function themeOnLoad() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.getElementsByTagName('body')[0].classList.toggle("light-theme");
    } 
}

toggleTheme();
window.onload = themeOnLoad();