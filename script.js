let remainingCombinations = []; // To store formats after the top 20

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  document.getElementById("continueBtn").style.display = "none";
  
  const fullName = document.getElementById("fullName").value.trim();
  const companyName = document.getElementById("companyName").value.trim();
  const nameParts = fullName.split(/\s+/);
  
  const firstName = nameParts[0] || "";
  const middleName = nameParts.length > 2 ? nameParts[1] : "";
  const lastName = nameParts.length > 2 ? nameParts[2] : (nameParts[1] || "");

  const emailList = document.getElementById("emailList");
  emailList.innerHTML = "";
  
  // PRIORITY LIST (Top 20)
  let top20 = [
    `${firstName}.${lastName}@${companyName}`,
    `${firstName}@${companyName}`,
    `${firstName.charAt(0)}${lastName}@${companyName}`,
    `${firstName}${lastName}@${companyName}`,
    `${firstName}.${middleName}.${lastName}@${companyName}`, // 3-word priority
    `${firstName}${middleName.charAt(0)}${lastName}@${companyName}`, // 3-word priority
    `${lastName}@${companyName}`,
    `${firstName.charAt(0)}.${lastName}@${companyName}`,
    `${firstName}-${lastName}@${companyName}`,
    `${firstName}_${lastName}@${companyName}`,
    `${firstName}.${lastName.charAt(0)}@${companyName}`,
    `${firstName}${lastName.charAt(0)}@${companyName}`,
    `${firstName.charAt(0)}${lastName.charAt(0)}@${companyName}`,
    `${firstName.charAt(0)}.${lastName.charAt(0)}@${companyName}`,
    `${lastName}.${firstName}@${companyName}`,
    `${firstName}-${middleName}-${lastName}@${companyName}`,
    `${firstName.charAt(0)}${middleName.charAt(0)}${lastName}@${companyName}`,
    `${firstName.charAt(0)}${lastName.charAt(0)}@${companyName}`,
    `${firstName}${middleName}@${companyName}`,
    `${firstName}.${middleName}@${companyName}`
  ];

  // ALL OTHER FORMATS
  let others = [
    `${lastName.charAt(0)}${firstName}@${companyName}`,
    `${lastName.charAt(0)}.${firstName}@${companyName}`,
    `${lastName}-${firstName}@${companyName}`,
    `${firstName.charAt(0)}-${lastName}@${companyName}`,
    `${lastName.charAt(0)}-${firstName}@${companyName}`,
    `${firstName}-${lastName.charAt(0)}@${companyName}`,
    `${lastName}-${firstName.charAt(0)}@${companyName}`,
    `${lastName}${firstName}@${companyName}`,
    `${lastName}.${firstName.charAt(0)}@${companyName}`,
    `${lastName}${firstName.charAt(0)}@${companyName}`,
    `${lastName}_${firstName}@${companyName}`,
    `${firstName.charAt(0)}_${lastName}@${companyName}`,
    `${lastName.charAt(0)}_${firstName}@${companyName}`,
    `${lastName.charAt(0)}.${firstName.charAt(0)}@${companyName}`,
    `${firstName.charAt(0)}_${lastName.charAt(0)}@${companyName}`,
    `${lastName.charAt(0)}_${firstName.charAt(0)}@${companyName}`,
    `${firstName}_${lastName.charAt(0)}@${companyName}`,
    `${lastName}_${firstName.charAt(0)}@${companyName}`,
    `${lastName.charAt(0)}${firstName.charAt(0)}@${companyName}`,
    `${firstName.charAt(0)}-${lastName.charAt(0)}@${companyName}`,
    `${lastName.charAt(0)}-${firstName.charAt(0)}@${companyName}`
  ];

  remainingCombinations = others; // Save for later
  resultCont.innerHTML = `<img width="83px" src="emoji-171_256.gif" alt="">`;
  let str = ``;
  let key = "API_KEY";
  let foundValid = false;

  // Function to render and validate
  async function validateBatch(batch) {
    for (let email of batch) {
      if (foundValid) break; // STOP IMMEDIATELY if valid is found

      // UI: Add to list
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

      // API Call
      try {
        let res = await fetch(`https://api.zerobounce.net/v2/validate?api_key=${key}&email=${email}&ip_address=156.124.12.145`);
        let result = await res.json();
        
        if (result.status) {
          str += `<li>${result.status}</li>`;
          resultCont.innerHTML = str;
          
          if (result.status.toLowerCase() === "valid" || result.status.toLowerCase() === "catch-all") {
            foundValid = true;
            resultCont.innerHTML += `<p style="color:blue; font-size:12px;">✔ Valid Email Found. Stopping.</p>`;
          }
        }
      } catch (e) { console.error(e); }
    }

    if (!foundValid && batch === top20) {
      document.getElementById("continueBtn").style.display = "block";
    }
  }

  await validateBatch(top20);
});

// Listener for the "Try Remaining" button
document.getElementById("continueBtn").addEventListener("click", async () => {
    document.getElementById("continueBtn").style.display = "none";
    // continue validating with remainingCombinations...
});
