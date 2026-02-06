const loginBtn = document.getElementById("loginBtn")
const signupBtn = document.getElementById("signupBtn")
const glider = document.querySelector(".glider")
const formTitle = document.getElementById("formTitle")
const submitBtn = document.getElementById("submitBtn")
const form = document.querySelector(".form")
const userInput = document.getElementById("usernameInput")
const passwordInput = document.getElementById("passwordInput")
const subtitle = document.querySelector(".subtitle")
const checkbox = document.querySelector(".checkbox")

function addEmailInput() {
    if (document.getElementById("emailInput")) return
    const emailGroup = document.createElement("div")
    emailGroup.className = "input-group"
    emailGroup.id = "emailGroup"
    emailGroup.innerHTML = `
        <label for="emailInput">Email</label>
        <input type="email" name="email" id="emailInput" placeholder="Enter your email" required>
    `
    form.insertBefore(emailGroup, passwordInput.closest(".input-group"))
}

function removeEmailInput() {
    const emailGroup = document.getElementById("emailGroup")
    if (emailGroup) emailGroup.remove()
}

signupBtn.addEventListener("click", () => {
    glider.style.transform = "translateX(100%)"
    
    formTitle.textContent = "Create Account"
    submitBtn.value = "Sign Up"
    
    signupBtn.classList.add("active")
    loginBtn.classList.remove("active")
    addEmailInput()
})

loginBtn.addEventListener("click", () => {
    glider.style.transform = "translateX(0)"
    
    formTitle.textContent = "Welcome Back"
    submitBtn.value = "Sign In"
    
    loginBtn.classList.add("active")
    signupBtn.classList.remove("active")
    removeEmailInput()
})


form.addEventListener("submit", async (event) => {
    event.preventDefault()
    const user = userInput.value
    const password = passwordInput.value
    const data = {user,password}
    let endpoint = "/api/signin"
    const isSignup = signupBtn.classList.contains("active")
    if(isSignup){
        endpoint = "/api/signup"
        const emailInput = document.getElementById("emailInput")
        if(emailInput) {
             data.email = emailInput.value
        }
    }
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!result.short && result.ok) {
        localStorage.setItem("user", result.user.username)
        localStorage.setItem("ID", result.user.id)
        localStorage.setItem("admin", result.user.isAdmin)

        if(checkbox.checked){
            localStorage.setItem("checked", "true")
        }
        else{
            localStorage.removeItem("checked")
        }

        window.location.href = "../chat.html"
    } 
    else {
        if(result.error){
            subtitle.textContent = result.error
            subtitle.style.color = "#ff4b4b"
        }
    }
})
const resetSubtitle = () => {
    subtitle.textContent = "Sign in to your account or create a new one"
    subtitle.style.color = "var(--text-gray)"
}
if(localStorage.getItem("checked") === "true"){
    userInput.value = localStorage.getItem("user") || ""
    if(checkbox) checkbox.checked = true
}
userInput.addEventListener("input", resetSubtitle)
passwordInput.addEventListener("input", resetSubtitle)