submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  // Logic to handle 1, 2, or 3 words from a single input
  const fullName = document.getElementById("fullName").value.trim();
  const companyName = document.getElementById("companyName").value.trim();
  
  const nameParts = fullName.split(/\s+/);
  const firstName = nameParts[0] || "";
  const middleName = nameParts.length > 2 ? nameParts[1] : "";
  const lastName = nameParts.length > 2 ? nameParts[2] : (nameParts[1] || "");

  const emailList = document.getElementById("emailList");
  emailList.innerHTML = "";

  // YOUR ORIGINAL 34 FORMATS (Unchanged)
  let suggestions = [
    `${firstName}.${lastName}@${companyName}`,
    `${lastName}.${firstName}@${companyName}`,
    `${firstName}@${companyName}`,
    `${lastName}@${companyName}`,
    `${firstName.charAt(0)}${lastName}@${companyName}`,
    `${lastName.charAt(0)}${firstName}@${companyName}`,
    `${firstName.charAt(0)}.${lastName}@${companyName}`,
    `${lastName.charAt(0)}.${firstName}@${companyName}`,
    `${firstName}-${lastName}@${companyName}`,
    `${lastName}-${firstName}@${companyName}`,
    `${firstName.charAt(0)}-${lastName}@${companyName}`,
    `${lastName.charAt(0)}-${firstName}@${companyName}`,
    `${firstName}-${lastName.charAt(0)}@${companyName}`,
    `${lastName}-${firstName.charAt(0)}@${companyName}`,
    `${firstName}${lastName}@${companyName}`,
    `${lastName}${firstName}@${companyName}`,
    `${firstName}.${lastName.charAt(0)}@${companyName}`,
    `${lastName}.${firstName.charAt(0)}@${companyName}`,
    `${firstName}${lastName.charAt(0)}@${companyName}`,
    `${lastName}${firstName.charAt(0)}@${companyName}`,
    `${firstName}_${lastName}@${companyName}`,
    `${lastName}_${firstName}@${companyName}`,
    `${firstName.charAt(0)}_${lastName}@${companyName}`,
    `${lastName.charAt(0)}_${firstName}@${companyName}`,
    `${firstName.charAt(0)}.${lastName.charAt(0)}@${companyName}`,
    `${lastName.charAt(0)}.${firstName.charAt(0)}@${companyName}`,
    `${firstName.charAt(0)}_${lastName.charAt(0)}@${companyName}`,
    `${lastName.charAt(0)}_${firstName.charAt(0)}@${companyName}`,
    `${firstName}_${lastName.charAt(0)}@${companyName}`,
    `${lastName}_${firstName.charAt(0)}@${companyName}`,
    `${firstName.charAt(0)}${lastName.charAt(0)}@${companyName}`,
    `${lastName.charAt(0)}${firstName.charAt(0)}@${companyName}`,
    `${firstName.charAt(0)}-${lastName.charAt(0)}@${companyName}`,
    `${lastName.charAt(0)}-${firstName.charAt(0)}@${companyName}`,
  ];

  // ADDITIONAL 3-WORD COMBINATIONS (Added only if middle name exists)
  if (middleName !== "") {
    const extra3WordFormats = [
      `${firstName}.${middleName}.${lastName}@${companyName}`,
      `${firstName}${middleName}${lastName}@${companyName}`,
      `${firstName.charAt(0)}${middleName.charAt(0)}${lastName}@${companyName}`,
      `${firstName.charAt(0)}.${middleName.charAt(0)}.${lastName}@${companyName}`,
      `${firstName}.${middleName.charAt(0)}.${lastName}@${companyName}`,
      `${firstName}${middleName.charAt(0)}${lastName}@${companyName}`,
      `${firstName.charAt(0)}${middleName}${lastName}@${companyName}`,
      `${firstName}-${middleName}-${lastName}@${companyName}`,
      `${firstName}_${middleName}_${lastName}@${companyName}`,
      `${firstName}${middleName.charAt(0)}@${companyName}`,
      `${firstName}.${middleName}@${companyName}`,
      `${firstName.charAt(0)}${middleName.charAt(0)}${lastName.charAt(0)}@${companyName}`,
      `${lastName}.${firstName}.${middleName.charAt(0)}@${companyName}`,
      `${firstName}${middleName.charAt(0)}${lastName.charAt(0)}@${companyName}`,
      `${firstName.charAt(0)}-${middleName.charAt(0)}-${lastName.charAt(0)}@${companyName}`,
      `${firstName}_${middleName.charAt(0)}@${companyName}`
    ];
    suggestions = [...suggestions, ...extra3WordFormats];
  }

  resultCont.innerHTML = `<img width="83px" src="emoji-171_256.gif" alt="">`;
  let emailCombinations = [];
  let str = ``;
  let key = "API_KEY"; // REPLACE WITH YOUR ACTUAL KEY

  suggestions.forEach((suggestion) => {
    const listItem = document.createElement("li");
    listItem.textContent = suggestion;

    const copyButton = document.createElement("button");
    copyButton.id = "CopyBtn";

    const imgElement = document.createElement("img");
    imgElement.src = "copy.png"; 
    imgElement.alt = "CopyImg";

    copyButton.appendChild(imgElement);
    copyButton.addEventListener("click", () => {
      copyToClipboard(suggestion);
    });

    listItem.appendChild(copyButton);
    emailCombinations.push(suggestion);
    emailList.appendChild(listItem);
  });

  for (let k = 0; k < emailCombinations.length; k++) {
    let email = emailCombinations[k];
    let url = `https://api.zerobounce.net/v2/validate?api_key=${key}&email=${email}&ip_address=156.124.12.145`;

    async function zbValidating() {
      try {
        let res = await fetch(url);
        let result = await res.json();
        for (let resKey of Object.keys(result)) {
          if (resKey == "status") {
            str = str + `<li>${result[resKey]}</li>`;
            resultCont.innerHTML = str;
          }
        }
      } catch (error) {
        console.error("Error validating email:", error);
      }
    }
    zbValidating();
  }
});

document.getElementById("resultCont").style.backgroundColor = "#5dffff78";
document.getElementById("resultCont").style.color = "green";

function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
