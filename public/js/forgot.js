const recoveryForm = document.getElementById("recoveryForm")
const emailInput = document.getElementById("emailInput")
const codeInput = document.getElementById("codeInput")
const verifyBtn = document.getElementById("verifyBtn")
const title = document.querySelector("h2")
const subtitle = document.querySelector(".subtitle")


verifyBtn.addEventListener("click", async (e) => {
    e.preventDefault()
    const email = emailInput.value
    const response = await fetch("/api/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
    const result = await response.json()
    if(result.ok){
        title.textContent = "Enter the code sent to your email"
        subtitle.textContent = "A 6-digit code has been sent to your email. Please enter it below to reset your password."
        emailInput.style.display = "none"
        verifyBtn.style.display = "none"
        codeInput.style.display = "block"
    }
})
codeInput.addEventListener("input", async () => {



    

})
