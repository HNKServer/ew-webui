import { getServerInfo, login } from "./api.mjs";
const form = document.querySelector("form");

function showError(message) {
    const modalTitle = document.getElementById("modal-title");
    const modalMessage = document.getElementById("modal-message");
    const modal = document.querySelector("dialog");

    modalTitle.textContent = "錯誤";
    modalMessage.textContent = message;
    modal.showModal();
}

document.querySelector(".close-button").addEventListener("click", () => {
    document.querySelector("dialog").close();
});

const uidElement = document.querySelector("form #id");
const passElement = document.querySelector("form #password");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let uid = uidElement.value.replaceAll(" ", "");
    let password = passElement.value;
    if (!uid || !password) {
        showError("缺少使用者 ID 或密碼");
        return;
    }
    if (isNaN(uid)) {
        showError("使用者 ID 應為數字。（個人資料中的 Friend ID）");
        return;
    }
    if (window.localStorage) localStorage.setItem("uid", uid);
    try {
        await login(parseInt(uid), password);
    } catch(e) {
        showError(e.message);
    }
})

uidElement.value = localStorage.getItem("uid") || "";

try {
    const info = await getServerInfo();
    if (info.account_import === true) {
        document.querySelector(".sub").style.display = "inline-block";
    }
} catch(e) {
    console.warn(e);
    // Ignore error
}

document.getElementById("import-button").addEventListener("click", e => {
    e.preventDefault();
    window.location.href = "import.html";
})
