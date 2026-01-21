const socket = io()

const messagesContainer = document.querySelector(".messages-container")
const chatForm = document.querySelector(".message-form")
const messageInput = document.getElementById('messageInput')
const sidebar = document.querySelector(".user-sidebar")
const usersListContainer = document.getElementById("users-list")

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


socket.emit("join", currentUser)
socket.on('updateUserList', ({ online, offline }) => {
    usersListContainer.innerHTML = ''

    const createGroup = (title, users, isOnline) => {
        if (users.length === 0) return

        const groupDiv = document.createElement('div')
        groupDiv.className = 'user-group'

        const h3 = document.createElement('h3')
        h3.className = 'group-title'
        h3.textContent = title + " - " + users.length
        groupDiv.appendChild(h3)

        users.forEach(user => {
            const userItem = document.createElement('div')

            if(isOnline) userItem.className = "user-item"
            else userItem.className = "user-item opacity-low"

            const avatarWrapper = document.createElement('div')
            if(isOnline) avatarWrapper.className = "avatar-wrapper status-online"
            else avatarWrapper.className = "avatar-wrapper status-offline"

            const img = document.createElement('img')
            img.src = "img/pfps/test.gif"
            img.alt = user

            const span = document.createElement('span')
            span.className = 'username'
            span.textContent = user

            avatarWrapper.appendChild(img)
            userItem.appendChild(avatarWrapper)
            userItem.appendChild(span)
            groupDiv.appendChild(userItem)
        })
        usersListContainer.appendChild(groupDiv)
    }

    createGroup('ONLINE', online, true);
    createGroup('OFFLINE', offline, false);
});

socket.on('chatMessage', (data) => {
    displayMessage(data)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
})

function displayMessage(data) {
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
    `
    
    messagesContainer.appendChild(div)
}