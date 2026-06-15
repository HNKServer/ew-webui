const navButton = document.querySelector("#ham-btn");
const navBar = document.querySelector('#nav-bar');

navButton.addEventListener("click", () => {
    navButton.classList.toggle("show");
    navBar.classList.toggle("show");
});

const date = new Date();
const currentYear = date.getFullYear();

document.getElementById("currentyear").innerText = currentYear;

let loggedIn = !!localStorage.getItem("loggedin");

document.getElementById("account").style.display = loggedIn ? "block" : "none";
document.getElementById("login").style.display = loggedIn ? "none" : "block";

