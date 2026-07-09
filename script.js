/* ==========================================
   BILLIFY
   SCRIPT.JS
========================================== */

/* ==========================================
   DATA
========================================== */

const participants = [];
const menus = [];

/* ==========================================
   ELEMENT
========================================== */

const participantContainer = document.getElementById("participants");
const menuContainer = document.getElementById("menus");
const resultContainer = document.getElementById("result");

const participantEmptyState = document.getElementById("participantEmptyState");
const menuEmptyState = document.getElementById("menuEmptyState");
const resultEmptyState = document.getElementById("resultEmptyState");

const addParticipantBtn = document.getElementById("addParticipant");
const addMenuBtn = document.getElementById("addMenu");
const calculateBtn = document.getElementById("calculateBtn");

/* ==========================================
   INIT
========================================== */

window.addEventListener("DOMContentLoaded", () => {

    addParticipant();
    addParticipant();

});

/* ==========================================
   EVENT
========================================== */

addParticipantBtn.addEventListener("click", addParticipant);
addMenuBtn.addEventListener("click", addMenu);
calculateBtn.addEventListener("click", calculateBill);
document
    .getElementById("shareBtn")
    .addEventListener("click", shareBill);

/* ==========================================
   PARTICIPANT
========================================== */

function addParticipant() {

    participants.push({
        id: crypto.randomUUID(),
        name: ""
    });

    renderParticipants();
    renderMenus();

}

/* ==========================================
   RENDER PARTICIPANT
========================================== */

function renderParticipants() {

    participantContainer.innerHTML = "";

    if (participants.length === 0) {

        participantEmptyState.style.display = "block";
        return;

    }

    participantEmptyState.style.display = "none";

    participants.forEach((participant, index) => {

        const card = document.createElement("div");
        card.className = "participant-card";

        card.innerHTML = `

            <div class="input-group">

                <label>Nama Peserta ${index + 1}</label>

                <input
                    type="text"
                    placeholder="Masukkan nama peserta"
                    value="${participant.name}">

            </div>

            <button class="secondary-btn delete-btn">
                Hapus
            </button>

        `;

        const input = card.querySelector("input");

        input.addEventListener("input", (e) => {

            participant.name = e.target.value;
            renderMenus();

        });

        const deleteBtn = card.querySelector(".delete-btn");

        deleteBtn.addEventListener("click", () => {

            const idx = participants.findIndex(p => p.id === participant.id);

            participants.splice(idx, 1);

            menus.forEach(menu => {

                menu.eaters = menu.eaters.filter(id => id !== participant.id);

            });

            renderParticipants();
            renderMenus();

        });

        participantContainer.appendChild(card);

    });

}

/* ==========================================
   MENU
========================================== */

function addMenu() {

    menus.push({
        id: crypto.randomUUID(),
        name: "",
        price: 0,
        eaters: []
    });

    renderMenus();

}

/* ==========================================
   RENDER MENU
========================================== */

function renderMenus() {

    menuContainer.innerHTML = "";

    if (menus.length === 0) {

        menuEmptyState.style.display = "block";
        return;

    }

    menuEmptyState.style.display = "none";

    menus.forEach((menu) => {

        const card = document.createElement("div");
        card.className = "glass-card";

        /* ==========================
           Nama Menu
        ========================== */

        const nameGroup = document.createElement("div");
        nameGroup.className = "input-group";

        nameGroup.innerHTML = `
            <label>Nama Menu</label>
            <input
                type="text"
                placeholder="Contoh : Ayam Geprek"
                value="${menu.name}">
        `;

        const nameInput = nameGroup.querySelector("input");

        nameInput.addEventListener("input", e => {

            menu.name = e.target.value;

        });

        /* ==========================
           Harga
        ========================== */

        const priceGroup = document.createElement("div");
        priceGroup.className = "input-group";
        priceGroup.style.marginTop = "15px";

        priceGroup.innerHTML = `
    <label>Harga</label>
    <input
        type="text"
        inputmode="numeric"
        placeholder="25.000"
        value="${menu.price ? formatRupiah(menu.price) : ""}">
`;

const priceInput = priceGroup.querySelector("input");

priceInput.addEventListener("input", e => {

    const raw = e.target.value.replace(/\D/g, "");

    menu.price = Number(raw);

    e.target.value = formatRupiah(raw);

});

        /* ==========================
           Peserta
        ========================== */

        const eaterTitle = document.createElement("h4");
        eaterTitle.innerText = "Dimakan oleh";
        eaterTitle.style.marginTop = "20px";
        eaterTitle.style.marginBottom = "10px";

        card.appendChild(nameGroup);
        card.appendChild(priceGroup);
        card.appendChild(eaterTitle);

        participants.forEach(person => {

            const label = document.createElement("label");

label.style.display = "flex";
label.style.alignItems = "center";
label.style.gap = "10px";
label.style.marginBottom = "8px";
label.style.cursor = "pointer";

const checkbox = document.createElement("input");

checkbox.type = "checkbox";
checkbox.style.margin = "0";
checkbox.style.flexShrink = "0";
checkbox.style.width = "20px";
checkbox.style.height = "20px";

            checkbox.checked = menu.eaters.includes(person.id);

            checkbox.addEventListener("change", () => {

                if (checkbox.checked) {

                    menu.eaters.push(person.id);

                } else {

                    menu.eaters = menu.eaters.filter(id => id !== person.id);

                }

            });

            label.appendChild(checkbox);

const text = document.createElement("span");
text.textContent = person.name || "Peserta";
text.style.whiteSpace = "nowrap";

label.appendChild(text);

card.appendChild(label);

        });

        /* ==========================
           Hapus Menu
        ========================== */

        const deleteBtn = document.createElement("button");

        deleteBtn.className = "secondary-btn";
        deleteBtn.style.marginTop = "20px";
        deleteBtn.innerHTML = "🗑️ Hapus Menu";

        deleteBtn.addEventListener("click", () => {

            const index = menus.findIndex(m => m.id === menu.id);

            menus.splice(index, 1);

            renderMenus();

        });

        card.appendChild(deleteBtn);

        menuContainer.appendChild(card);

    });

}

/* ==========================================
   CALCULATOR
========================================== */
function formatRupiah(value) {

    const number = value.toString().replace(/\D/g, "");

    if (!number) return "";

    return Number(number).toLocaleString("id-ID");

}

function unformatRupiah(value) {

    return Number(value.replace(/\./g, ""));

}
function calculateBill() {

    if (participants.length < 2) {
        alert("Minimal ada 2 peserta.");
        return;
    }

    if (menus.length === 0) {
        alert("Belum ada menu.");
        return;
    }

    const tax = Number(document.getElementById("tax").value) || 0;
    const service = Number(document.getElementById("service").value) || 0;
    const otherCost = Number(document.getElementById("otherCost").value) || 0;

    let subtotal = 0;

    const result = {};

    participants.forEach(person => {

        result[person.id] = {
            name: person.name || "Peserta",
            subtotal: 0,
            tax: 0,
            service: 0,
            other: 0,
            total: 0,
            items: []
        };

    });

    menus.forEach(menu => {

        const price = Number(menu.price) || 0;

        subtotal += price;

        if (menu.eaters.length === 0) return;

        const split = price / menu.eaters.length;

        menu.eaters.forEach(id => {

            result[id].subtotal += split;

            result[id].items.push({
                name: menu.name,
                price: split
            });

        });

    });

    const taxAmount = subtotal * tax / 100;
    const serviceAmount = subtotal * service / 100;

    participants.forEach(person => {

        const p = result[person.id];

        if (subtotal > 0) {

            const ratio = p.subtotal / subtotal;

            p.tax = taxAmount * ratio;
            p.service = serviceAmount * ratio;
            p.other = otherCost * ratio;

        }

        p.total =
            p.subtotal +
            p.tax +
            p.service +
            p.other;

    });

    renderResult(
        result,
        subtotal,
        taxAmount,
        serviceAmount,
        otherCost
    );

}

/* ==========================================
   RESULT
========================================== */

function renderResult(result, subtotal, taxAmount, serviceAmount, otherCost) {

    resultContainer.innerHTML = "";

    resultEmptyState.style.display = "none";

    Object.values(result).forEach(person => {

        const card = document.createElement("div");
        card.className = "result-card";

        let itemsHTML = "";

        person.items.forEach(item => {

            itemsHTML += `
                <div style="display:flex;justify-content:space-between;margin:6px 0;">
                    <span>${item.name}</span>
                    <span>Rp ${Math.round(item.price).toLocaleString("id-ID")}</span>
                </div>
            `;

        });

        const tax = person.subtotal / subtotal * taxAmount;
        const service = person.subtotal / subtotal * serviceAmount;
        const other = person.subtotal / subtotal * otherCost;

        card.innerHTML = `

            <h3>${person.name}</h3>

            ${itemsHTML}

            <hr style="margin:15px 0;">

            <div style="display:flex;justify-content:space-between;">
                <span>Subtotal</span>
                <span>Rp ${Math.round(person.subtotal).toLocaleString("id-ID")}</span>
            </div>

            <div style="display:flex;justify-content:space-between;">
                <span>PPN</span>
                <span>Rp ${Math.round(tax).toLocaleString("id-ID")}</span>
            </div>

            <div style="display:flex;justify-content:space-between;">
                <span>Service</span>
                <span>Rp ${Math.round(service).toLocaleString("id-ID")}</span>
            </div>

            <div style="display:flex;justify-content:space-between;">
                <span>Biaya Lain</span>
                <span>Rp ${Math.round(other).toLocaleString("id-ID")}</span>
            </div>

            <hr style="margin:15px 0;">

            <div style="display:flex;justify-content:space-between;align-items:center;">

                <strong>Total</strong>

                <div class="result-price">

                    Rp ${Math.round(person.total).toLocaleString("id-ID")}

                </div>

            </div>

        `;

        resultContainer.appendChild(card);

    });

    const grandTotal =
        subtotal +
        taxAmount +
        serviceAmount +
        otherCost;

    const summary = document.createElement("div");
    summary.className = "result-card";

    summary.innerHTML = `

        <h3>Ringkasan Tagihan</h3>

        <div style="display:flex;justify-content:space-between;margin-top:15px;">
            <span>Subtotal</span>
            <strong>Rp ${Math.round(subtotal).toLocaleString("id-ID")}</strong>
        </div>

        <div style="display:flex;justify-content:space-between;">
            <span>PPN</span>
            <strong>Rp ${Math.round(taxAmount).toLocaleString("id-ID")}</strong>
        </div>

        <div style="display:flex;justify-content:space-between;">
            <span>Service</span>
            <strong>Rp ${Math.round(serviceAmount).toLocaleString("id-ID")}</strong>
        </div>

        <div style="display:flex;justify-content:space-between;">
            <span>Biaya Lain</span>
            <strong>Rp ${Math.round(otherCost).toLocaleString("id-ID")}</strong>
        </div>

        <hr style="margin:15px 0;">

        <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>Grand Total</strong>
            <div class="result-price">
                Rp ${Math.round(grandTotal).toLocaleString("id-ID")}
            </div>
        </div>

    `;

    resultContainer.appendChild(summary);

}
/* ==========================================
   SHARE BILL
========================================== */

function shareBill() {

    if (resultContainer.children.length === 0) {
        alert("Hitung Split Bill terlebih dahulu.");
        return;
    }

    let text = "🍽️ BILLIFY\n";
    text += "━━━━━━━━━━━━━━━━━━━━\n\n";

    const cards = document.querySelectorAll(".result-card");

    cards.forEach((card, index) => {

        // skip ringkasan
        if (index === cards.length - 1) return;

        const name = card.querySelector("h3").innerText;

        text += `👤 ${name}\n\n`;

        const rows = card.querySelectorAll("div");

        rows.forEach(row => {

            const spans = row.querySelectorAll("span");

            if (spans.length === 2) {

                text += `${spans[0].innerText}\n`;
                text += `${spans[1].innerText}\n\n`;

            }

        });

        const total = card.querySelector(".result-price");

        if (total) {

            text += "💰 TOTAL\n";
            text += `${total.innerText}\n`;

        }

        text += "\n━━━━━━━━━━━━━━━━━━━━\n\n";

    });

    text += "Generated by Billify\n";
    text += "https://billify-topaz.vercel.app";

    if (navigator.share) {

        navigator.share({
            title: "Billify",
            text: text
        });

    } else {

        navigator.clipboard.writeText(text).then(() => {

            showToast("✅ Text Copied");

        });

    }

}

/* ==========================================
   TOAST
========================================== */

function showToast(message) {

    const toast = document.createElement("div");

    toast.innerText = message;

    toast.style.position = "fixed";
    toast.style.left = "50%";
    toast.style.top = "50%";
    toast.style.transform = "translate(-50%, -50%)";
    toast.style.background = "#6C63FF";
    toast.style.color = "#fff";
    toast.style.padding = "16px 28px";
    toast.style.borderRadius = "12px";
    toast.style.fontWeight = "600";
    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,.2)";
    toast.style.zIndex = "99999";
    toast.style.opacity = "1";
    toast.style.transition = ".3s";

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.style.opacity = "0";

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 1800);

}