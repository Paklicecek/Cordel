const recoveryForm = document.getElementById("recoveryForm")
const emailInput = document.getElementById("emailInput")
const codeInput = document.getElementById("codeInput")
const verifyBtn = document.getElementById("verifyBtn")
const title = document.querySelector("h2")
const subtitle = document.querySelector(".subtitle")
const emailLabel = document.querySelector(".emailLabel")
const emailGroup = document.querySelector(".email-group")
const codeGroup = document.querySelector(".code-group")

verifyBtn.addEventListener("click", async (e) => {
        if(codeGroup.classList.contains("code-group")){
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
            subtitle.style.color = "green"
    
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
            console.log("Yay it works!")
        }
        else console.log("You fucked up!")
    }
})
