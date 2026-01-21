const socket = io();

const messagesContainer = document.querySelector(".messages-container")
const chatForm = document.querySelector(".message-form")
const messageInput = document.getElementById('messageInput')

const currentUser = localStorage.getItem("user")
const id = localStorage.getItem("ID")

if(!currentUser){
    window.location.href = "../index.html"
}

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const msg = messageInput.value
    
    if (!msg) {
        return
    }
    const messageData = {
        user: currentUser,
        msg: msg
    }
    socket.emit('chatMessage', messageData)
    messageInput.value = ''

})
socket.on('chatMessage', (data) => {
    outputMessage(data);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
})

function outputMessage(data) {
    const div = document.createElement('div')
    div.classList.add('message')

    const date = new Date(data.time || Date.now())
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const day = date.getDate()
    const month = date.getMonth() + 1 

    const formattedTime = `${day}.${month}. ${hours}:${minutes}`

    div.innerHTML = `
        <div class="avatar-wrapper">
            <img src="../img/pfps/test.gif" alt="Avatar">
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="username">${data.user}</span>
                <span class="timestamp">${formattedTime}</span>
            </div>
            <p class="text">${data.msg}</p>
        </div>
    `;
    
    messagesContainer.appendChild(div);
}