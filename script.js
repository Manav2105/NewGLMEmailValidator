let others = [];
let isStopped = false;
let foundValid = false;
const apiKey = "YOUR_API_KEY"; // REPLACE THIS

const submitBtn = document.getElementById("submitBtn");
const stopBtn = document.getElementById("stopBtn");
const continueBtn = document.getElementById("continueBtn");
const resultsGrid = document.getElementById("resultsGrid");
const scanner = document.getElementById("scanner");

async function checkBatch(list) {
    isStopped = false;
    stopBtn.style.display = "inline-block";
    
    for (const email of list) {
        if (isStopped || foundValid) break;

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-top"><span>RECORD DETAILS</span><span class="status">PENDING</span></div>
            <div class="email">${email}</div>
        `;
        resultsGrid.prepend(card);

        try {
            const res = await fetch(`https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${email}`);
            const data = await res.json();
            
            const badge = card.querySelector(".status");
            badge.textContent = data.status;

            if (data.status === "valid") {
                card.classList.add("valid");
                foundValid = true;
                document.getElementById("v-count").innerText = parseInt(document.getElementById("v-count").innerText) + 1;
            } else if (data.status === "catch-all") {
                card.classList.add("catch-all");
            }
            document.getElementById("c-count").innerText = parseInt(document.getElementById("c-count").innerText) + 1;

        } catch (e) { console.error("API Error"); }
    }
    stopBtn.style.display = "none";
}

submitBtn.addEventListener("click", async () => {
    const name = document.getElementById("fullName").value.trim();
    const domain = document.getElementById("domain").value.trim();
    const parts = name.split(/\s+/);

    if (parts.length > 3) {
        alert("Max 3 words allowed.");
        return;
    }

    // Reset
    resultsGrid.innerHTML = "";
    foundValid = false;
    scanner.style.display = "block";
    submitBtn.style.display = "none";

    const f = parts[0] || "", m = parts.length > 2 ? parts[1] : "", l = parts.length > 2 ? parts[2] : (parts[1] || "");

    const all = [
        `${f}.${l}@${domain}`, `${f}@${domain}`, `${f.charAt(0)}${l}@${domain}`,
        `${f}${l}@${domain}`, `${f.charAt(0)}.${l}@${domain}`, `${f}-${l}@${domain}`
    ];
    
    if (m) all.unshift(`${f}.${m}.${l}@${domain}`, `${f}${m}${l}@${domain}`);

    const top20 = all.slice(0, 20);
    others = all.slice(20);

    await checkBatch(top20);

    scanner.style.display = "none";
    submitBtn.style.display = "inline-block";
    if (!foundValid && others.length > 0) continueBtn.style.display = "block";
});

stopBtn.addEventListener("click", () => {
    isStopped = true;
    scanner.style.display = "none";
});

continueBtn.addEventListener("click", () => {
    continueBtn.style.display = "none";
    checkBatch(others);
});
