const recoveryForm = document.getElementById("recoveryForm")
const emailInput = document.getElementById("emailInput")
const codeInput = document.getElementById("codeInput")
const verifyBtn = document.getElementById("verifyBtn")
const title = document.querySelector("h2")
const subtitle = document.querySelector(".subtitle")
const emailLabel = document.querySelector(".emailLabel")
const emailGroup = document.querySelector(".email-group")
const codeGroup = document.querySelector(".code-group")
const codeLabel = document.querySelector(".codeLabel")

let currentStep = "none"

verifyBtn.addEventListener("click", async (e) => {
    if(currentStep === "password"){
        e.preventDefault()
        let password1 = emailInput.value
        let password2 = codeInput.value
        if(password1 != password2){
            title.textContent = "Passwords are not matching."
            title.style.color = "Red"
            return
        }
        const email = localStorage.getItem("email")
        const response = await fetch("/api/password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password: password1,email })
        })
        const result = await response.json()
        if(result.ok && !result.short){
            title.textContent = result.message
            title.style.color = "Green"
            subtitle.textContent = "After 4 seconds you will be sent back to login page."
            setTimeout(() => {
                window.location = "../index.html"
            }, 4000)
        }
        else{
            title.textContent = result.message
            title.style.color = "Red"
        }
    }
    else if(codeGroup.classList.contains("code-group")){
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
            title.textContent = "Code has been sent to your email"
            title.style.color = "green"
            subtitle.textContent = "A code has been sent to your email. Please enter it below."
    
            emailGroup.classList.add("code-group")
            codeGroup.classList.remove("code-group")
        }
    }
    else{
        e.preventDefault()
        let code = codeInput.value
        let email = localStorage.getItem("email")
        const response = await fetch("/api/code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({code,email})
        })
        let result = await response.json()
        if(result.ok == true){
            title.textContent = "Enter your new password"
            subtitle.textContent = "Enter your new password down below."

            emailGroup.classList.remove("code-group")
            emailLabel.textContent = "New password"
            emailInput.placeholder = "Your new password"
            emailInput.value = ""
            emailInput.type = "password"

            codeLabel.textContent = "New password again"
            codeInput.placeholder = "Your new password again"
            codeInput.value = ""
            codeInput.removeAttribute("maxlength")
            codeInput.type = "password"
            verifyBtn.value = "Confirm password"

            currentStep = "password"
        }
        else{
            title.textContent = result.message
            title.style.color = "Red"
            subtitle.textContent = "Please try again later."
        } 
    }
})
