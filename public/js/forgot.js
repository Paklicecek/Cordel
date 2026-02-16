const recoveryForm = document.getElementById("recoveryForm")
const emailInput = document.getElementById("emailInput")
const codeInput = document.getElementById("codeInput")
const verifyBtn = document.getElementById("verifyBtn")
const title = document.querySelector("h2")
const subtitle = document.querySelector(".subtitle")
const emailLabel = document.querySelector(".emailLabel")
const emailGroup = document.querySelector(".email-group")

verifyBtn.addEventListener("click", async (e) => {
    e.preventDefault()
    const email = emailInput.value
    localStorage.setItem("email", email)
    const response = await fetch("/api/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
    const result = await response.json()
    if(result.ok){
        title.textContent = "Enter the code sent to your email."
        subtitle.textContent = "A code has been sent to your email. Please enter it below."
        emailInput.style.display = "none"
        verifyBtn.style.display = "none"
        emailLabel.style.display = "none"
        emailGroup.style.marginBottom = "0px"
    }
})
codeInput.addEventListener("input", async () => {
    code = codeInput.value
    const response = await fetch("/api/code", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({code})
    })
    let result = await response.json()
    if(result.ok == true){
        console.log("Yay it works!")
    }
    else console.log("You fucked up!")
})
