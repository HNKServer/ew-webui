import { getUserInformation, fetchAllCardInfo, startLoginBonus, cheatMode, getLoginBonusList, exportUserAccount } from "./api.mjs";

function showError(message) {
    const modalTitle = document.getElementById("modal-title");
    const modalMessage = document.getElementById("modal-message");
    const modal = document.querySelector("dialog");

    modalTitle.textContent = "錯誤";
    modalMessage.textContent = message;
    modal.showModal();
}

function showMessage(message) {
    const modalTitle = document.getElementById("modal-title");
    const modalMessage = document.getElementById("modal-message");
    const modal = document.querySelector("dialog");

    modalTitle.textContent = "訊息";
    modalMessage.textContent = message;
    modal.showModal();
}

document.querySelector(".close-button").addEventListener("click", () => {
    document.querySelector("dialog").close();
});

const cards = await fetchAllCardInfo();

function getCardName(id) {
    if (!cards[id]) return "";
    return cards[id].name;
}

function getCardPicture(id) {
    const card = cards[id];
    if (!card) return "";
    return `images/card-thumbnails/t_${card.image}.webp`;
}

if (!localStorage.getItem("loggedin")) {
    window.location.href = "login.html";
    throw new Error("Not logged in");
}

const data = await getUserInformation();
const userData = data.userdata;
console.log(data);

document.getElementById("user-name").textContent = userData.user.name;
document.getElementById("user-id").textContent = userData.user.id;
document.getElementById("user-exp").textContent = userData.user.exp;
document.getElementById("user-main-deck-slot").textContent = userData.user.main_deck_slot;
document.getElementById("user-rank").textContent = userData.user.rank;
document.getElementById("user-stamina").textContent = userData.stamina.stamina

document.getElementById("gem-total").textContent = userData.gem.total;
document.getElementById("gem-free").textContent = userData.gem.free;

const cardList = userData.deck_list[userData.user.main_deck_slot - 1].main_card_ids;

const cardGrid = document.getElementById("card-grid");
if (cardList && cardList.length > 0) {
    cardList.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.innerHTML = `
            <img src="${getCardPicture(card)}" alt="${getCardName(card)}">
            <p>${getCardName(card)}</p>
        `;
        cardGrid.appendChild(cardElement);
    });
} else {
    cardGrid.textContent = "找不到卡牌。";
}

function displayBonuses() {
    const bonusList = document.getElementById("login-bonus-list");
    bonusList.innerHTML = "";
    if (Array.isArray(data.loginbonus.bonus_list) && data.loginbonus.bonus_list.length > 0) {
        data.loginbonus.bonus_list.forEach(elem => {
            const li = document.createElement("li");
            li.innerText = elem.master_login_bonus_id;
            bonusList.appendChild(li);
        });
    } else {
        bonusList.innerText = "目前沒有登入獎勵";
    }
}
displayBonuses();

const bonuses = document.getElementById("bonuses");
function setupLoginBonus(loginBonus) {
    for (const k in loginBonus) {
        const bonus = loginBonus[k];
        const option = document.createElement("option");
        option.setAttribute("value", k);
        option.textContent = `${k}: ${bonus.en}`;
        bonuses.appendChild(option);
    }
}

try {
    const loginBonus = await getLoginBonusList();
    setupLoginBonus(loginBonus);
} catch(e) {
    showError(`Error setting up login bonus: ${e.message}`);
}
document.getElementById("login-bonus-form").addEventListener("submit", async e => {
    e.preventDefault();
    let id = parseInt(bonuses.value);
    if (isNaN(id) || id <= 0) {
        return showError("登入獎勵 ID 必須大於 0。");
    }
    try {
        let resp = await startLoginBonus(id);
        if (resp.result === "OK") {
            data.loginbonus.bonus_list.push({master_login_bonus_id: resp.id});
            displayBonuses();
        }
    } catch(e) {
        return showError(`Error: ${e.message}`);
    }
    textInput.value = "";
});

const timeStatus = document.getElementById("current-server-time");
function updateServerTime(time) {
    if (time === 0) {
        timeStatus.textContent = "現在";
    } else {
        timeStatus.textContent = (new Date(time * 1000)).toString();
    }
}

updateServerTime(data.time);

document.querySelector(".give-me-money button").addEventListener("click", async (e) => {
    try {
        await cheatMode();
        showMessage(`資源已補發，可到遊戲內禮物盒領取。`);
    } catch(e) {
        showError(`Error: ${e.message}`);
    }
})

function downloadFile(contents, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([contents], {type: "application/json"}));
    a.download = name;
    a.click();
}
document.getElementById("export-account").addEventListener("click", async (e) => {
    try {
        const data = await exportUserAccount();
        downloadFile(data.userdata, "userdata.json");
        downloadFile(data.userhome, "userhome.json");
        downloadFile(data.missions, "missions.json");
        downloadFile(data.sifcards, "sifcards.json");
    } catch(e) {
        showError(`Error: ${e.message}`);
    }
})
document.getElementById("logout").addEventListener("click", async (e) => {
    localStorage.removeItem("loggedin");
    window.location.href = "/webui/logout"
})
