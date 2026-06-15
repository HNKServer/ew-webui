const apiBaseUrl = window.location.origin;
export async function fetchCards(page, query, lang = "JP") {
    if (isNaN(page)) page = 1;
    try {
        const q = typeof query === "string" && query.trim() ? `&query=${encodeURIComponent(query)}` : "";
        const response = await fetch(`${apiBaseUrl}/api/webui/listCards?page=${page}&lang=${encodeURIComponent(lang)}${q}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching cards:", error);
        return null;
    }
}

export async function fetchAllCardInfo(lang = "JP") {
    try {
        const response = await fetch(`${apiBaseUrl}/api/webui/listCards?all=true&lang=${encodeURIComponent(lang)}`);
        const data = await response.json();
        const cards = data.current;
        let rv = {};
        for (let i = 0; i < cards.length; i++) {
            rv[cards[i].id] = cards[i];
        }
        return rv;
    } catch (error) {
        console.error("Error fetching all cards:", error);
        return null;
    }
}

export async function fetchMusic(page, lang = "EN") {
    if (isNaN(page)) page = 1;
    const url = `${apiBaseUrl}/api/webui/listMusic?page=${page}&lang=${encodeURIComponent(lang)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching music:", error);
        return null;
    }
}

export async function login(username, password) {
    let options = {
        method: "POST",
        body: JSON.stringify({
            uid: parseInt(username),
            password: password
        }),
        credentials: "include"
    }
    try {
        const resp = await fetch(`${apiBaseUrl}/api/webui/login`, options);
        const json = await resp.json();
        if (json.result === "ERR") {
            throw new Error(json.message);
        }
    } catch(e) {
        console.error("Error logging in:", e);
        throw e;
    }
    localStorage.setItem("loggedin", "true")
    window.location.href = "account.html"
}

export async function getUserInformation() {
    let options = {
        credentials: "include"
    }
    try {
        const resp = await fetch(`${apiBaseUrl}/api/webui/userInfo`, options);
        const userData = await resp.json();
        if (userData.result === "ERR") {
            throw new Error(json.message);
        }
        return userData.data;
    } catch(e) {
        window.location.href = "login.html";
        localStorage.removeItem("loggedin");
    }
}

export async function getServerInfo() {
    try {
        const resp = await fetch(`${apiBaseUrl}/api/webui/serverInfo`);
        const data = await resp.json();
        if (data.result === "ERR") {
            throw new Error(json.message);
        }
        return data.data;
    } catch(e) {
        return null;
    }
}

export async function importUser(data) {
    let options = {
        method: "POST",
        body: JSON.stringify(data)
    }
    try {
        const resp = await fetch(`${apiBaseUrl}/api/webui/import`, options);
        const json = await resp.json();
        if (json.result === "ERR") {
            throw new Error(json.message);
        }
        return json;
    } catch(e) {
        console.error("Error importing user:", e);
        throw e;
    }
}

export async function startLoginBonus(bonusId) {
    let options = {
        method: "POST",
        body: JSON.stringify({
            bonus_id: bonusId
        }),
        credentials: "include"
    }
    try {
        const resp = await fetch(`${apiBaseUrl}/api/webui/startLoginbonus`, options);
        const json = await resp.json();
        if (json.result === "ERR") {
            throw new Error(json.message);
        }
        return json;
    } catch(e) {
        console.error("Error starting login bonus:", e);
        throw e;
    }
}

export async function setTime(timestamp) {
    let options = {
        method: "POST",
        body: JSON.stringify({ timestamp }),
        credentials: "include"
    }
    try {
        const resp = await fetch(`${apiBaseUrl}/api/webui/set_time`, options);
        const json = await resp.json();
        if (json.result === "ERR") {
            throw new Error(json.message);
        }
        return json;
    } catch(e) {
        console.error("Error setting time:", e);
        throw e;
    }
}

export async function cheatMode() {
    let options = {
        method: "POST",
        credentials: "include"
    }
    try {
        const resp = await fetch(`${apiBaseUrl}/api/webui/cheat`, options);
        const json = await resp.json();
        if (json.result === "ERR") {
            throw new Error(json.message);
        }
        return json;
    } catch(e) {
        console.error("User couldn't cheat:", e);
        throw e;
    }
}

export async function getLoginBonusList() {
    try {
        const resp = await fetch(`${apiBaseUrl}/api/webui/listLoginBonus`);
        const json = await resp.json();
        return json;
    } catch(e) {
        console.error("Couldnt get login bonus list:", e);
        throw e;
    }
}

export async function exportUserAccount() {
    let options = {
        credentials: "include"
    }
    try {
        const resp = await fetch(`${apiBaseUrl}/api/webui/export`, options);
        const json = await resp.json();
        if (json.result === "ERR") {
            throw new Error(json.message);
        }
        return json.data;
    } catch(e) {
        console.error("Couldn't export user account:", e);
        throw e;
    }
}

export const clearRateHtmlSrc = `${apiBaseUrl}/live_clear_rate.html`;
