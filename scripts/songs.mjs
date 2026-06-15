import { fetchMusic, clearRateHtmlSrc } from "./api.mjs";
import { navigation } from "./navigation.mjs"

const musicList = document.querySelector(".music-list");
const urlParams = new URLSearchParams(window.location.search);

const labels = {
    EN: {
        title: "Music Database",
        noSongs: "No songs found.",
        artist: "Artist",
        detail: "Details",
        released: "Released On",
        clearRate: "View Clear Rate"
    },
    JP: {
        title: "楽曲データベース",
        noSongs: "楽曲が見つかりません。",
        artist: "歌手",
        detail: "詳細",
        released: "配信日",
        clearRate: "クリア率を見る"
    },
    "ZH-CHT": {
        title: "歌曲資料庫",
        noSongs: "找不到歌曲。",
        artist: "演唱者",
        detail: "歌曲資訊",
        released: "配信日期",
        clearRate: "查看 Live 通關率"
    }
};

function normLang(value) {
    const v = (value || "").toUpperCase();
    if (["ZH", "ZH_HANT", "ZH-HANT", "ZH-TW", "ZH-HK", "ZH-CHT"].includes(v)) return "ZH-CHT";
    if (v === "EN") return "EN";
    return "JP";
}

let language = normLang(urlParams.get("lang") || localStorage.getItem("webui-lang") || localStorage.getItem("lang") || "ZH-CHT");
let currentPage = parseInt(urlParams.get("page")) || 1;

function applyLabels() {
    const l = labels[language] || labels["ZH-CHT"];
    document.querySelector("main h1").textContent = l.title;
    const clearRateLink = document.querySelector(".clear-rate-link");
    if (clearRateLink) clearRateLink.textContent = l.clearRate;
    document.querySelectorAll(".language-selector button").forEach(btn => {
        btn.classList.toggle("active", normLang(btn.dataset.lang) === language);
    });
}

function displayMusic(music) {
    const l = labels[language] || labels["ZH-CHT"];
    if (!music || !music.current) {
        musicList.innerHTML = `<p>${l.noSongs}</p>`;
        return;
    }
    musicList.innerHTML = "";
    music.current.forEach(item => {
        const musicItem = document.createElement("div");
        musicItem.classList.add("music-item");

        const title = document.createElement("strong");
        title.textContent = item.name || "";
        musicItem.appendChild(title);

        const artist = document.createElement("p");
        artist.textContent = `${l.artist}: ${item.artist || ""}`;
        musicItem.appendChild(artist);

        if (item.detailInfo) {
            const detail = document.createElement("p");
            detail.innerHTML = `${l.detail}: ${item.detailInfo}`;
            musicItem.appendChild(detail);
        }

        const released = document.createElement("p");
        released.textContent = `${l.released}: ${item.releaseDateTime || ""}`;
        musicItem.appendChild(released);

        musicList.appendChild(musicItem);
    });
}

const nav = new navigation(".page-navigation", handlePageChange);

async function handlePageChange(newPage, data, init) {
    if (!data) {
        data = await fetchMusic(newPage, language);
    }
    musicList.innerHTML = "";
    displayMusic(data);
    window.scrollTo(0, 0);
    if (!init) updateHistory(newPage, language);
    currentPage = newPage;
}

function updateHistory(page, language) {
    window.history.pushState({}, "", `?page=${page}&lang=${encodeURIComponent(language)}`);
}

function updateSelectedLanguage(lang, init) {
    language = normLang(lang);
    localStorage.setItem("webui-lang", language);
    localStorage.setItem("lang", language);
    applyLabels();
    if (!init) {
        handlePageChange(currentPage);
        updateHistory(currentPage, language);
    }
}

document.querySelectorAll(".language-selector button").forEach(button => {
    button.addEventListener("click", (e) => {
        updateSelectedLanguage(e.currentTarget.dataset.lang);
    });
});

async function init() {
    applyLabels();
    const data = await fetchMusic(currentPage, language);
    if (data) {
        nav.createPagination(data.total_pages);
        nav.setActiveButton(currentPage);
    } else {
        nav.clearPagination();
    }
    updateSelectedLanguage(language, true);
    handlePageChange(currentPage, data, true);
}

init();

document.querySelector(".clear-rate-link").href = clearRateHtmlSrc;
