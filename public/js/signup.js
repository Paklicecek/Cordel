const form = document.querySelector(".form")
const userInput = document.getElementById("usernameInput")
const passwordInput = document.getElementById("passwordInput")

form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const user = userInput.value
    const password = passwordInput.value

    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({user,password})
    });

    const result = await response.json()

    if (!result.short) {
        // Create some UI for when you succesfully signed up + fix the location swapping
        alert(result.message)
        //window.location.href = "/login.html"
    } else {
        console.log(result.error)
        if(result.error){
            console.error("Chyba: " + result.error)
        }
    }
})