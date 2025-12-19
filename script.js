submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const companyName = document.getElementById("companyName").value.trim();
  const emailList = document.getElementById("emailList");
  emailList.innerHTML = "";
  const suggestions = [
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
  resultCont.innerHTML = `<img width="83px" src="emoji-171_256.gif" alt="">`;
  let emailCombinations = [];
  let str = ``;
  // let key = "e6fb42b4035142b19f1a9f2a8634fb9c";
  let key = "API_KEY";

  suggestions.forEach((suggestion) => {
    const listItem = document.createElement("li");
    listItem.textContent = suggestion;

    // Create a copy button for each email with an image
    const copyButton = document.createElement("button");
    copyButton.id = "CopyBtn";

    // Create an image element
    const imgElement = document.createElement("img");
    // imgElement.src = "/copy-icons/copy.png";
    imgElement.src = "copy.png";
    // imgElement.src = "copy2.png";
    // imgElement.src = "copy3.png";
    imgElement.alt = "CopyImg";

    // Append the image to the button
    copyButton.appendChild(imgElement);

    copyButton.addEventListener("click", () => {
      copyToClipboard(suggestion);
    });

    // Append the email and copy button to the list item
    listItem.appendChild(copyButton);

    emailCombinations.push(suggestion);
    emailList.appendChild(listItem);
  });

  for (let k = 0; k < emailCombinations.length; k++) {
    let email = emailCombinations[k];
    let url = `https://api.zerobounce.net/v2/validate?api_key=${key}&email=${email}&ip_address=156.124.12.145`;

    zbValidating();
    async function zbValidating() {
      try {
        let res = await fetch(url);
        let result = await res.json();
        for (key of Object.keys(result)) {
          if (key == "status") {
            // OPTIMIZATION
            // if (result[key].toLowerCase() != "valid" && result[key].toLowerCase()!="catch-all"){
            //   // Stop execution if the result is "valid"
            //   console.log("Validation result is 'valid'. Stopping execution.");
            //   return;
            // }
            str = str + `<li>${result[key]}</li>`;
          }
          resultCont.innerHTML = str;
        }
      } catch (error) {
        console.error("Error validating email:", error);
      }
    }
  }
});

document.getElementById("resultCont").style.backgroundColor = "#5dffff78";
document.getElementById("resultCont").style.color = "green";

// Function to copy text to clipboard
function copyToClipboard(text, button) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  console.log("Email copied to clipboard: " + text);
}
