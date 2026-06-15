import { getServerInfo, importUser } from "./api.mjs";
const userdataFile = document.getElementById("userdataFile");
const userhomeFile = document.getElementById("userhomeFile");
const usermissionsFile = document.getElementById("usermissionsFile");
const usersifcardsFile = document.getElementById("usersifcardsFile");
const passwordElement = document.getElementById("password");
const form = document.querySelector("form");

const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const modal = document.querySelector("dialog");
const modalClose = document.querySelector(".close-button");
let closeAction = () => {
    document.querySelector("dialog").close();
}

function success(uid, migration) {
    modalClose.textContent = "前往登入"
    modalTitle.textContent = "成功";
    modalMessage.textContent = `UserID: ${uid}
    Migration ID: ${migration}`;
    modal.showModal();
    closeAction = () => {
        window.location.href = "login.html"
    }
}

function showError(message) {
    modalTitle.textContent = '錯誤';
    modalMessage.textContent = message;
    modal.showModal();
}

modalClose.addEventListener("click", () => {
    closeAction();
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!userdataFile.files[0] || !userhomeFile.files[0] || !passwordElement.value) {
        showError("一個或多個必填項目缺失。");
        return;
    }
    let data;
    try {
        data = {
            userdata: JSON.parse(await userdataFile.files[0].text()),
            home: JSON.parse(await userhomeFile.files[0].text()),
            missions: usermissionsFile.files[0] ? JSON.parse(await usermissionsFile.files[0].text()) : undefined,
            sif_cards: usersifcardsFile.files[0] ? JSON.parse(await usersifcardsFile.files[0].text()) : undefined,
            password: passwordElement,
            jp: true
        }
        if (!data.userdata || !data.userdata.user || !data.userdata.user.id) {
            throw new Error("使用者資料檔格式不正確");
        }
        if (!data.home || !data.home.home || !data.home.home.information_list) {
            throw new Error("Home 資料檔格式不正確");
        }
        if (!Array.isArray(data.missions) && data.missions) {
            throw new Error("Mission 資料檔格式不正確");
        }
        if (!Array.isArray(data.sif_cards) && data.sif_cards) {
            throw new Error("SIF 卡牌資料檔格式不正確");
        }
    } catch(e) {
        showError(`Could not read/parse JSON files.\n${e.message}`);
        return;
    }
    
    localStorage.setItem("uid", data.userdata.user.id);
    try {
        const result = await importUser(data);
        success(result.uid, result.migration_token);
    } catch(e) {
        showError(`Failed to import user: ${e.message}`);
        return;
    }
})
