const loginBtn = document.getElementById('loginBtn')
const signupBtn = document.getElementById('signupBtn')
const glider = document.querySelector('.glider')
const formTitle = document.getElementById('formTitle')
const submitBtn = document.getElementById('submitBtn')
const form = document.querySelector(".form")
const userInput = document.getElementById("usernameInput")
const passwordInput = document.getElementById("passwordInput")

function addEmailInput() {
    if (document.getElementById('emailInput')) return
    const emailGroup = document.createElement('div')
    emailGroup.className = "input-group"
    emailGroup.id = "emailGroup"
    emailGroup.innerHTML = `
        <label for="emailInput">Email</label>
        <input type="email" name="email" id="emailInput" placeholder="Enter your email">
    `;
    form.insertBefore(emailGroup, passwordInput.closest('.input-group'));
}

function removeEmailInput() {
    const emailGroup = document.getElementById('emailGroup')
    if (emailGroup) emailGroup.remove()
}

signupBtn.addEventListener('click', () => {
    glider.style.transform = 'translateX(100%)'
    
    formTitle.textContent = "Create Account"
    submitBtn.value = "Sign Up"
    
    signupBtn.classList.add('active')
    loginBtn.classList.remove('active')
    addEmailInput()
})

loginBtn.addEventListener('click', () => {
    glider.style.transform = 'translateX(0)'
    
    formTitle.textContent = "Welcome Back"
    submitBtn.value = "Sign In"
    
    loginBtn.classList.add('active')
    signupBtn.classList.remove('active')
    removeEmailInput()
})


form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const user = userInput.value
    const password = passwordInput.value
    let endpoint = '/api/signin'
    if(submitBtn.classList.contains("active")){
        endpoint = '/api/signup'
    }
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({user,password})
    });

    const result = await response.json()

    if (!result.short && result.ok) {
        // Create some UI for when you succesfully signed up + fix the location swapping
        alert(result.message)
        //window.location.href = "/login.html"
    } else {
        if(result.error){
            console.error("Chyba: " + result.error)
        }
    }
})