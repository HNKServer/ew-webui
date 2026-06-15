import { fetchCards } from "./api.mjs";
import { navigation } from "./navigation.mjs"

const urlParams = new URLSearchParams(window.location.search);
const cardGrid = document.querySelector(".card-grid");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const languageButtons = document.querySelectorAll(".lang-btn");

const labels = {
    EN:{title:"Card Database",search:"Search",placeholder:"Search cards...",empty:"No cards found.",character:"Character",rarity:"Rarity",attribute:"Attribute"},
    JP:{title:"カードデータベース",search:"検索",placeholder:"カードを検索...",empty:"カードが見つかりません。",character:"キャラクター",rarity:"レアリティ",attribute:"属性"},
    "ZH-CHT":{title:"卡牌資料庫",search:"搜尋",placeholder:"搜尋卡牌...",empty:"找不到卡牌。",character:"成員",rarity:"稀有度",attribute:"屬性"}
};
function normLang(v) { return ["ZH", "ZH_HANT", "ZH-HANT", "ZH-TW", "ZH-HK", "ZH-CHT"].includes((v || "").toUpperCase()) ? "ZH-CHT" : (v || "JP").toUpperCase(); }
let language = normLang(urlParams.get("lang") || localStorage.getItem("webui-lang") || "ZH-CHT");
let query = urlParams.get("query") || "";

function applyLabels() {
    const l = labels[language] || labels["ZH-CHT"];
    document.querySelector("main h1").textContent = l.title;
    searchInput.placeholder = l.placeholder;
    searchButton.textContent = l.search;
    languageButtons.forEach(button => button.classList.toggle("active", normLang(button.dataset.lang) === language));
}

function displayCards(cards) {
    const l = labels[language] || labels["ZH-CHT"];
    if (!cards || !cards.current) { cardGrid.innerHTML = `<p>${l.empty}</p>`; return; }
    cards.current.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        const image = document.createElement("img");
        image.src = `webui/images/card-thumbnails/t_${card.image || card.illustId}.webp`;
        image.alt = card.name;
        image.setAttribute("loading", "lazy");
        cardElement.appendChild(image);
        const strong = document.createElement("strong");
        strong.textContent = card.name;
        cardElement.appendChild(strong);
        const characterParagraph = document.createElement("p");
        const characterI = document.createElement("i");
        characterI.textContent = `${l.character}: ${card.character || ""}`;
        characterParagraph.appendChild(characterI);
        cardElement.appendChild(characterParagraph);
        const rarityParagraph = document.createElement("p");
        rarityParagraph.textContent = `${l.rarity}: ${card.rarityName || card.rarity || ""}`;
        cardElement.appendChild(rarityParagraph);
        const attributeParagraph = document.createElement("p");
        attributeParagraph.textContent = `${l.attribute}: ${card.attribute || ""}`;
        cardElement.appendChild(attributeParagraph);
        cardGrid.appendChild(cardElement);
    });
}

const nav = new navigation(".page-navigation", handlePageChange);
async function handlePageChange(newPage, data, init) {
    if (!data) data = await fetchCards(newPage, query, language);
    cardGrid.innerHTML = "";
    displayCards(data);
    const q = typeof query === "string" && query.trim() ? `&query=${encodeURIComponent(query)}` : "";
    if (!init) window.history.pushState({}, "", `?page=${newPage}&lang=${encodeURIComponent(language)}${q}`);
    window.scrollTo(0, 0);
}
const currentPage = parseInt(urlParams.get("page")) || 1;
async function init(first) {
    applyLabels();
    const initialData = await fetchCards(currentPage, query, language);
    if (initialData) nav.createPagination(initialData.total_pages); else nav.clearPagination();
    handlePageChange(currentPage, initialData, first);
    nav.setActiveButton(currentPage);
}
init(true);
async function search() { query = searchInput.value.trim(); init(false); }
searchButton.addEventListener("click", search);
searchInput.addEventListener("keydown", async (event) => { if (event.key === "Enter") search(); });
searchInput.value = query;
languageButtons.forEach(button => button.addEventListener("click", () => { language = normLang(button.dataset.lang); localStorage.setItem("webui-lang", language); init(false); }));
