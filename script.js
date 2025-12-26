let remainingBatch = [];
let isStopped = false;
let validCount = 0;
let catchCount = 0;
const apiKey = "API_KEY"; // REPLACE WITH YOUR KEY

const submitBtn = document.getElementById("submitBtn");
const stopBtn = document.getElementById("stopBtn");
const continueBtn = document.getElementById("continueBtn");
const loader = document.getElementById("loader");
const resultsWrapper = document.getElementById("resultsWrapper");

async function validateEmail(email) {
    if (isStopped) return "stopped";

    // Create the Record Card UI
    const card = document.createElement("div");
    card.className = "record-card";
    card.innerHTML = `
        <div class="card-header"><span>RECORD DETAILS</span><span class="badge">ANALYZING...</span></div>
        <div class="email-text">${email}</div>
        <div class="card-footer" style="font-size: 0.7rem; color: #555;">Waiting for server response...</div>
    `;
    resultsWrapper.prepend(card);

    try {
        const response = await fetch(`https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${email}&ip_address=156.124.12.145`);
        const result = await response.json();
        
        const badge = card.querySelector(".badge");
        const footer = card.querySelector(".card-footer");
        badge.textContent = result.status.toUpperCase();
        footer.textContent = `Sub-status: ${result.sub_status || 'none'} | Credit deducted: 1`;

        if (result.status === "valid") {
            card.classList.add("valid");
            badge.style.background = "#28a745";
            validCount++;
            document.getElementById("validCount").textContent = validCount;
            return "found";
        } else if (result.status === "catch-all") {
            card.classList.add("catch-all");
            badge.style.background = "#ffcc00";
            badge.style.color = "black";
            catchCount++;
            document.getElementById("catchCount").textContent = catchCount;
            return "found";
        }
    } catch (e) { console.error(e); }
    return "next";
}

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value.trim();
    const company = document.getElementById("companyName").value.trim();
    const nameParts = fullName.split(/\s+/);

    if (nameParts.length > 3) {
        alert("SECURITY ALERT: Maximum 3 words allowed in name input.");
        return;
    }

    // Reset UI
    resultsWrapper.innerHTML = "";
    isStopped = false;
    validCount = 0;
    catchCount = 0;
    loader.style.display = "block";
    submitBtn.style.display = "none";
    stopBtn.style.display = "inline-block";

    const f = nameParts[0] || "";
    const m = nameParts.length > 2 ? nameParts[1] : "";
    const l = nameParts.length > 2 ? nameParts[2] : (nameParts[1] || "");

    // Your Original 34 + 3-word extras
    let suggestions = [
        `${f}.${l}@${company}`, `${l}.${f}@${company}`, `${f}@${company}`, `${l}@${company}`,
        `${f.charAt(0)}${l}@${company}`, `${f.charAt(0)}.${l}@${company}`, `${f}-${l}@${company}`,
        `${f}${l}@${company}`, `${f}_${l}@${company}`, `${f}.${l.charAt(0)}@${company}`
        // ... include your full original list here
    ];

    if (m !== "") {
        suggestions.unshift(`${f}.${m}.${l}@${company}`, `${f}${m}${l}@${company}`, `${f.charAt(0)}${m.charAt(0)}${l}@${company}`);
    }

    const top20 = suggestions.slice(0, 20);
    remainingBatch = suggestions.slice(20);

    for (let email of top20) {
        const status = await validateEmail(email);
        if (status === "found" || status === "stopped") break;
    }

    loader.style.display = "none";
    stopBtn.style.display = "none";
    submitBtn.style.display = "inline-block";
    if (!isStopped && remainingBatch.length > 0) continueBtn.style.display = "block";
});

stopBtn.addEventListener("click", () => {
    isStopped = true;
    loader.style.display = "none";
});
