const recoveryForm = document.getElementById("recoveryForm")
const emailInput = document.getElementById("emailInput")
const codeInput = document.getElementById("codeInput")
const verifyBtn = document.getElementById("verifyBtn")
const title = document.querySelector("h2")
const subtitle = document.querySelector(".subtitle")

function generateCode() {
    const code = Math.floor(Math.random() * 1000000);
    return code.toString().padStart(6, '0');
}

