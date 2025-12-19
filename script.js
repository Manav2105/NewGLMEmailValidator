let remainingCombinations = [];
let foundValid = false;
let stopRequested = false;
let currentStr = "";
const key = "API_KEY"; // REPLACE WITH YOUR KEY

const submitBtn = document.getElementById("submitBtn");
const stopBtn = document.getElementById("stopBtn");
const continueBtn = document.getElementById("continueBtn");
const resultCont = document.getElementById("resultCont");
const emailList = document.getElementById("emailList");

function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

async function validateBatch(batch) {
    stopRequested = false;
    stopBtn.style.display = "inline-block";

    for (let email of batch) {
        if (foundValid || stopRequested) break;

        const listItem = document.createElement("li");
        listItem.innerHTML = `${email} <button id="CopyBtn" onclick="copyToClipboard('${email}')"><img src="copy.png"></button>`;
        emailList.appendChild(listItem);

        try {
            let res = await fetch(`https://api.zerobounce.net/v2/validate?api_key=${key}&email=${email}&ip_address=1.1.1.1`);
            let result = await res.json();
            
            if (result.status) {
                currentStr += `<li style="padding: 8px; border-bottom: 1px solid #f9f9f9; color: ${result.status === 'valid' ? 'green' : 'black'}">${result.status}</li>`;
                resultCont.innerHTML = currentStr;
                
                if (result.status.toLowerCase() === "valid" || result.status.toLowerCase() === "catch-all") {
                    foundValid = true;
                    resultCont.innerHTML += `<p style="color:#a100ff; font-weight:bold; padding:10px;">MATCH FOUND - TERMINATING PROCESS</p>`;
                }
            }
        } catch (error) { console.error("Error:", error); }
    }
    stopBtn.style.display = "none";
}

stopBtn.addEventListener("click", () => {
    stopRequested = true;
    resultCont.innerHTML += `<p style="color:red; font-weight:bold; padding:10px;">PROCESS STOPPED BY USER</p>`;
});

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value.trim();
    const companyName = document.getElementById("companyName").value.trim();
    const nameParts = fullName.split(/\s+/);

    if (nameParts.length > 3) {
        resultCont.innerHTML = `<p style="color: red; border: 1px solid red; padding: 15px;"><strong>ACCESS DENIED:</strong> Maximum 3 words allowed for Name input.</p>`;
        return;
    }

    emailList.innerHTML = "";
    resultCont.innerHTML = "Initializing Analysis...";
    currentStr = "";
    foundValid = false;
    continueBtn.style.display = "none";

    const f = nameParts[0] || "";
    const m = nameParts.length > 2 ? nameParts[1] : "";
    const l = nameParts.length > 2 ? nameParts[2] : (nameParts[1] || "");

    let top20 = [
        `${f}.${l}@${companyName}`, `${f}@${companyName}`, `${f.charAt(0)}${l}@${companyName}`, 
        `${f}${l}@${companyName}`, `${f}.${m}.${l}@${companyName}`, `${f}${m.charAt(0)}${l}@${companyName}`,
        `${l}@${companyName}`, `${f.charAt(0)}.${l}@${companyName}`, `${f}-${l}@${companyName}`,
        `${f}_${l}@${companyName}`, `${f}.${l.charAt(0)}@${companyName}`, `${f}${l.charAt(0)}@${companyName}`,
        `${f.charAt(0)}${l.charAt(0)}@${companyName}`, `${f.charAt(0)}.${l.charAt(0)}@${companyName}`,
        `${l}.${f}@${companyName}`, `${f}-${m}-${l}@${companyName}`, `${f.charAt(0)}${m.charAt(0)}${l}@${companyName}`,
        `${f}${m}@${companyName}`, `${f}.${m}@${companyName}`, `${f.charAt(0)}${m}${l}@${companyName}`
    ];

    remainingCombinations = [
        `${l.charAt(0)}${f}@${companyName}`, `${l.charAt(0)}.${f}@${companyName}`, `${l}-${f}@${companyName}`,
        `${f.charAt(0)}-${l}@${companyName}`, `${l.charAt(0)}-${f}@${companyName}`, `${f}-${l.charAt(0)}@${companyName}`,
        `${l}-${f.charAt(0)}@${companyName}`, `${l}${f}@${companyName}`, `${l}.${f.charAt(0)}@${companyName}`,
        `${l}_${f}@${companyName}`, `${f.charAt(0)}_${l}@${companyName}`, `${l.charAt(0)}_${f}@${companyName}`
    ];

    await validateBatch(top20);
    if (!foundValid && !stopRequested) continueBtn.style.display = "block";
});

continueBtn.addEventListener("click", async () => {
    continueBtn.style.display = "none";
    await validateBatch(remainingCombinations);
});
