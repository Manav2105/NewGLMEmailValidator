let remainingCombinations = [];
let foundValid = false;
let isStopped = false;
let currentStr = "";
let key = "64a348f4f4144e03b53dddde4ad596cd"; // REPLACE WITH YOUR KEY

const submitBtn = document.getElementById("submitBtn");
const continueBtn = document.getElementById("continueBtn");
const stopBtn = document.getElementById("stopBtn");
const resultCont = document.getElementById("resultCont");
const emailList = document.getElementById("emailList");

async function validateBatch(batch) {
  isStopped = false;
  stopBtn.style.display = "inline-block";

  for (let email of batch) {
    if (foundValid || isStopped) break;

    const listItem = document.createElement("li");
    listItem.textContent = email;
    const copyButton = document.createElement("button");
    copyButton.id = "CopyBtn";
    const imgElement = document.createElement("img");
    imgElement.src = "copy.png";
    copyButton.appendChild(imgElement);
    copyButton.addEventListener("click", () => copyToClipboard(email));
    listItem.appendChild(copyButton);
    emailList.appendChild(listItem);

    try {
      let res = await fetch(`https://api.zerobounce.net/v2/validate?api_key=${key}&email=${email}&ip_address=156.124.12.145`);
      let result = await res.json();
      if (result.status) {
        currentStr += `<li>${result.status}</li>`;
        resultCont.innerHTML = currentStr;
        if (result.status.toLowerCase() === "valid" || result.status.toLowerCase() === "catch-all") {
          foundValid = true;
          resultCont.innerHTML += `<p style="color:blue;">✔ Valid Found. Process Stopped.</p>`;
        }
      }
    } catch (error) { console.error(error); }
  }
  stopBtn.style.display = "none";
}

stopBtn.addEventListener("click", () => {
  isStopped = true;
  resultCont.innerHTML += `<p style="color:red;">Process Stopped by User.</p>`;
});

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const fullName = document.getElementById("fullName").value.trim();
  const companyName = document.getElementById("companyName").value.trim();
  const nameParts = fullName.split(/\s+/);

  if (nameParts.length > 3) {
    resultCont.innerHTML = `<p style="color:red; font-weight:bold;">⚠ Error: Please enter a maximum of 3 words.</p>`;
    return;
  }

  emailList.innerHTML = "";
  resultCont.innerHTML = `<img width="83px" src="emoji-171_256.gif" alt="">`;
  currentStr = "";
  foundValid = false;
  continueBtn.style.display = "none";

  const firstName = nameParts[0] || "";
  const middleName = nameParts.length > 2 ? nameParts[1] : "";
  const lastName = nameParts.length > 2 ? nameParts[2] : (nameParts[1] || "");

  // YOUR ORIGINAL 34 Suggestion Formats
  let suggestions = [
    `${firstName}.${lastName}@${companyName}`, `${lastName}.${firstName}@${companyName}`,
    `${firstName}@${companyName}`, `${lastName}@${companyName}`,
    `${firstName.charAt(0)}${lastName}@${companyName}`, `${lastName.charAt(0)}${firstName}@${companyName}`,
    `${firstName.charAt(0)}.${lastName}@${companyName}`, `${lastName.charAt(0)}.${firstName}@${companyName}`,
    `${firstName}-${lastName}@${companyName}`, `${lastName}-${firstName}@${companyName}`,
    `${firstName.charAt(0)}-${lastName}@${companyName}`, `${lastName.charAt(0)}-${firstName}@${companyName}`,
    `${firstName}-${lastName.charAt(0)}@${companyName}`, `${lastName}-${firstName.charAt(0)}@${companyName}`,
    `${firstName}${lastName}@${companyName}`, `${lastName}${firstName}@${companyName}`,
    `${firstName}.${lastName.charAt(0)}@${companyName}`, `${lastName}.${firstName.charAt(0)}@${companyName}`,
    `${firstName}${lastName.charAt(0)}@${companyName}`, `${lastName}${firstName.charAt(0)}@${companyName}`,
    `${firstName}_${lastName}@${companyName}`, `${lastName}_${firstName}@${companyName}`,
    `${firstName.charAt(0)}_${lastName}@${companyName}`, `${lastName.charAt(0)}_${firstName}@${companyName}`,
    `${firstName.charAt(0)}.${lastName.charAt(0)}@${companyName}`, `${lastName.charAt(0)}.${firstName.charAt(0)}@${companyName}`,
    `${firstName.charAt(0)}_${lastName.charAt(0)}@${companyName}`, `${lastName.charAt(0)}_${firstName.charAt(0)}@${companyName}`,
    `${firstName}_${lastName.charAt(0)}@${companyName}`, `${lastName}_${firstName.charAt(0)}@${companyName}`,
    `${firstName.charAt(0)}${lastName.charAt(0)}@${companyName}`, `${lastName.charAt(0)}${firstName.charAt(0)}@${companyName}`,
    `${firstName.charAt(0)}-${lastName.charAt(0)}@${companyName}`, `${lastName.charAt(0)}-${firstName.charAt(0)}@${companyName}`
  ];

  // Organize for Top 20 vs Remaining
  let top20 = suggestions.slice(0, 20);
  remainingCombinations = suggestions.slice(20);

  // Add extra 3-word formats if middle name exists
  if (middleName !== "") {
    let extras = [
      `${firstName}.${middleName}.${lastName}@${companyName}`,
      `${firstName}${middleName}${lastName}@${companyName}`,
      `${firstName.charAt(0)}${middleName.charAt(0)}${lastName}@${companyName}`,
      `${firstName.charAt(0)}.${middleName.charAt(0)}.${lastName}@${companyName}`
    ];
    top20 = [...top20, ...extras];
  }

  await validateBatch(top20);
  if (!foundValid && !isStopped) continueBtn.style.display = "block";
});

continueBtn.addEventListener("click", async () => {
  continueBtn.style.display = "none";
  await validateBatch(remainingCombinations);
});

function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

document.getElementById("resultCont").style.backgroundColor = "#5dffff78";
document.getElementById("resultCont").style.color = "green";
