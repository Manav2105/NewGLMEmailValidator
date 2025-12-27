let others = [];
let isStopped = false;
let foundValid = false;
let key = "YOUR_API_KEY"; // REPLACE WITH YOUR KEY

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

        // Create Card
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-top"><span>RECORD DETAILS</span><span class="status">PENDING</span></div>
            <div class="email">${email}</div>
        `;
        resultsGrid.prepend(card);

        try {
            const res = await fetch(`https://api.zerobounce.net/v2/validate?api_key=${key}&email=${email}&ip_address=156.124.12.145`);
            const data = await res.json();
            
            const badge = card.querySelector(".status");
            badge.textContent = data.status || "Error";

            // Update Counters
            document.getElementById("c-count").innerText = parseInt(document.getElementById("c-count").innerText) + 1;

            if (data.status === "valid" || data.status === "catch-all") {
                card.classList.add(data.status === "valid" ? "valid" : "catch-all");
                if (data.status === "valid") {
                    foundValid = true;
                    document.getElementById("v-count").innerText = parseInt(document.getElementById("v-count").innerText) + 1;
                }
            }
        } catch (e) { 
            console.error("API Call Failed"); 
        }
    }
    stopBtn.style.display = "none";
}

submitBtn.addEventListener("click", async () => {
    const fullName = document.getElementById("fullName").value.trim();
    const company = document.getElementById("domain").value.trim();
    const parts = fullName.split(/\s+/);

    if (parts.length > 3) {
        alert("Error: Maximum 3 words allowed.");
        return;
    }

    // Reset UI
    resultsGrid.innerHTML = "";
    document.getElementById("v-count").innerText = "0";
    document.getElementById("c-count").innerText = "0";
    foundValid = false;
    scanner.style.display = "block";
    submitBtn.style.display = "none";

    const f = parts[0] || "";
    const m = parts.length > 2 ? parts[1] : "";
    const l = parts.length > 2 ? parts[2] : (parts[1] || "");

    // Full 34 Formats + 3-word extras
    let all = [
        `${f}.${l}@${company}`, `${l}.${f}@${company}`, `${f}@${company}`, `${l}@${company}`,
        `${f.charAt(0)}${l}@${company}`, `${l.charAt(0)}${f}@${company}`,
        `${f.charAt(0)}.${l}@${company}`, `${l.charAt(0)}.${f}@${company}`,
        `${f}-${l}@${company}`, `${l}-${f}@${company}`,
        `${f.charAt(0)}-${l}@${company}`, `${l.charAt(0)}-${f}@${company}`,
        `${f}-${l.charAt(0)}@${company}`, `${l}-${f.charAt(0)}@${company}`,
        `${f}${l}@${company}`, `${l}${f}@${company}`,
        `${f}.${l.charAt(0)}@${company}`, `${l}.${f.charAt(0)}@${company}`,
        `${f}${l.charAt(0)}@${company}`, `${l}${f.charAt(0)}@${company}`,
        `${f}_${l}@${company}`, `${l}_${f}@${company}`,
        `${f.charAt(0)}_${l}@${company}`, `${l.charAt(0)}_${f}@${company}`,
        `${f.charAt(0)}.${l.charAt(0)}@${company}`, `${l.charAt(0)}.${f.charAt(0)}@${company}`,
        `${f.charAt(0)}_${l.charAt(0)}@${company}`, `${l.charAt(0)}_${f.charAt(0)}@${company}`,
        `${f}_${l.charAt(0)}@${company}`, `${l}_${f.charAt(0)}@${company}`,
        `${f.charAt(0)}${l.charAt(0)}@${company}`, `${l.charAt(0)}${f.charAt(0)}@${company}`,
        `${f.charAt(0)}-${l.charAt(0)}@${company}`, `${l.charAt(0)}-${f.charAt(0)}@${company}`
    ];
    
    if (m) {
        all.unshift(`${f}.${m}.${l}@${company}`, `${f}${m}${l}@${company}`, `${f}.${m.charAt(0)}.${l}@${company}`);
    }

    const top20 = all.slice(0, 20);
    others = all.slice(20);

    await checkBatch(top20);

    scanner.style.display = "none";
    submitBtn.style.display = "inline-block";
    if (!foundValid && others.length > 0) continueBtn.style.display = "block";
});

stopBtn.addEventListener("click", () => { isStopped = true; scanner.style.display = "none"; });
continueBtn.addEventListener("click", () => { continueBtn.style.display = "none"; checkBatch(others); });
