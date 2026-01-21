const socket = io();

const messagesContainer = document.querySelector(".messages-container")
const chatForm = document.querySelector(".message-form")
const messageInput = document.getElementById('messageInput')

socket.on('chatMessage', (msg) => {
    outputMessage(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const msg = messageInput.value
    
    if (!msg) {
        return
    }
    socket.emit('chatMessage', msg)
    messageInput.value = ''

})

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    
    div.innerHTML = `
        <div class="avatar-wrapper">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}" alt="Avatar">
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="username">Anonymous</span>
                <span class="timestamp">${new Date().toLocaleTimeString()}</span>
            </div>
            <p class="text">${message}</p>
        </div>
    `;
    
    messagesContainer.appendChild(div);
}