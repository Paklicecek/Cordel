const socket = io()

const messagesContainer = document.querySelector(".messages-container")
const chatForm = document.querySelector(".message-form")
const messageInput = document.getElementById("messageInput")
const sidebar = document.querySelector(".user-sidebar")
const usersListContainer = document.getElementById("users-list")
const usernameBox = document.querySelector(".my-username")
const logoutBtn = document.getElementById("logoutBtn")
const avatar = document.getElementById("currentUserAvatar")
const pfpPopup = document.getElementById("pfpPopup")
const pfpCancelBtn = document.getElementById("pfpCancelBtn")
const pfpSaveBtn = document.getElementById("pfpSaveBtn")
const pfpFileInput = document.getElementById("pfpFileInput")

const currentUser = localStorage.getItem("user")
const isAdmin = localStorage.getItem("admin")
const id = localStorage.getItem("ID")

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.clear()
        window.location.href = "index.html"
    })
}

usernameBox.textContent = currentUser
if(isAdmin === "true"){
    usernameBox.classList.add("admin")
}

if(!currentUser){
    window.location.href = "../index.html"
}
chatForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const msg = messageInput.value
    
    if (!msg.trim()) {
        return
    }
    const messageData = {
        user: currentUser,
        msg: msg
    }
    if(isAdmin == "true"){
        if(msg.includes("/admin")){
            const userName = msg.split("/admin")[1].trim()
            if(!userName) return
            
            try{
                const response = await fetch("/api/setAdmin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({toSetAdmin: userName})
                })
        
                const result = await response.json()
                console.log(result.message)
                console.log("This change may take some time please reload your window to see changes.")
                
                messageInput.value = ""
                return
            }
            catch (err) {
                console.error("Admin error:", err)
            }
        }
    }
    socket.emit("chatMessage", messageData)
    messageInput.value = ""
})


socket.emit("join", currentUser)
socket.on("updateUserList", ({ online, offline }) => {
    usersListContainer.innerHTML = ""

    const createGroup = (title, users, isOnline) => {
        if (users.length === 0) return

        const groupDiv = document.createElement("div")
        groupDiv.className = "user-group"

        const h3 = document.createElement("h3")
        h3.className = "group-title"
        h3.textContent = title + " - " + users.length
        groupDiv.appendChild(h3)

        users.forEach(user => {
            const userItem = document.createElement("div")

            if(isOnline) userItem.className = "user-item"
            else userItem.className = "user-item opacity-low"

            const avatarWrapper = document.createElement("div")
            if(isOnline) avatarWrapper.className = "avatar-wrapper status-online"
            else avatarWrapper.className = "avatar-wrapper status-offline"

            const img = document.createElement("img")
            img.src = (user.avatar_url || "img/pfps/test.gif")
            img.alt = user.username

            const span = document.createElement("span")
            span.textContent = user.username
            if(user.is_admin === true){
                span.className = "username admin"
            }
            else{
                span.className = "username"
            }

            avatarWrapper.appendChild(img)
            userItem.appendChild(avatarWrapper)
            userItem.appendChild(span)
            groupDiv.appendChild(userItem)
        })
        usersListContainer.appendChild(groupDiv)
    }

    createGroup("ONLINE", online, true)
    createGroup("OFFLINE", offline, false)
})

socket.on("chatMessage", (data) => {
    displayMessage(data)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
})

function displayMessage(data) {
    const formattedMsg = data.msg.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" class="link" style="color: #00A8FC;" target="_blank">$1</a>'
    )

    const div = document.createElement("div")
    div.classList.add("message")

    const date = new Date(data.time || Date.now())
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const day = date.getDate()
    const month = date.getMonth() + 1 

    const formattedTime = `${day}.${month}. ${hours}:${minutes}`
    if(data.isAdmin === true){
        div.innerHTML = `
        <div class="avatar-wrapper">
            <img src="${data.avatar}" alt="Avatar">
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="username admin">${data.user}</span>
                <span class="timestamp">${formattedTime}</span>
                <img src="img/icons/trash.png" alt="Delete" class="delete-btn"/>
            </div>
            <p class="text">${formattedMsg}</p>
        </div>
    `
    }
    else{
        div.innerHTML = `
            <div class="avatar-wrapper">
                <img src="${data.avatar}" alt="Avatar">
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="username">${data.user}</span>
                    <span class="timestamp">${formattedTime}</span>
                    <img src="img/icons/trash.png" alt="Delete" class="delete-btn"/>
                </div>
                <p class="text">${formattedMsg}</p>
            </div>
        `
    }
    div.id = `msg-${data.msgId}`
    messagesContainer.appendChild(div)
}

messagesContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains("delete-btn")) {
        const deleteMsg = e.target.closest(".message")
        const msgId = deleteMsg.id.split("-")[1]
    
        const msgOwner = deleteMsg.querySelector(".username").textContent
        if(isAdmin === "true") socket.emit("deleteMessage", msgId)
        else if(msgOwner === currentUser) socket.emit("deleteMessage", msgId)
        else alert("You can only delete your own messages!")
    }
})
socket.on("deleteMessage", (msgId) => {
    const messageDiv = document.getElementById(`msg-${msgId}`)

    if (messageDiv) {
        messageDiv.remove()
    }
})
let timer
messageInput.addEventListener("input", ()=> {
    socket.emit("typing")
    clearTimeout(timer)
    timer = setTimeout(() => {
        socket.emit("stopTyping")
    }, 5000)
    
})


let usersList = []
socket.on("typing",(user) => {
    if(!usersList.includes(user)){
        usersList.push(user)
    }
    if(usersList.length === 0)chatForm.setAttribute("data-label", "")
    else if(usersList.length >= 2) chatForm.setAttribute("data-label", "More users is typing...")
    else chatForm.setAttribute("data-label", usersList[0] + " is typing...")
})
socket.on("stopTyping",(user) => {
    let index = usersList.indexOf(user)
    console.log(usersList[index] + " stopped typing")
    if(usersList[index] + " is typing..."  === chatForm.getAttribute("data-label")){
        chatForm.setAttribute("data-label", "")
    }
    else if("More users is typing..."  === chatForm.getAttribute("data-label")) chatForm.setAttribute("data-label", "")
    if(index !== -1) {
        usersList.splice(index, 1)
    }   
})
messageInput.focus()

avatar.addEventListener("click", () => {
pfpPopup.classList.remove("closed")
pfpPopup.classList.add("opened")

})
pfpCancelBtn.addEventListener("click", () => {
    pfpPopup.classList.remove("opened")
    pfpPopup.classList.add("closed")
})
pfpSaveBtn.addEventListener("click", async () => {
    const file = pfpFileInput.files[0]

    if (!file) return

    const formData = new FormData()
    formData.append("avatar", file)
    formData.append("username", currentUser)

    try {
        const originalText = pfpSaveBtn.innerText
        pfpSaveBtn.innerText = "Uploading..."
        pfpSaveBtn.disabled = true

        const response = await fetch("/api/pfp", {
            method: "POST",
            body: formData
        })
        const result = await response.json()
        
        if (result.ok) {
            pfpFileInput.value = ""
            location.reload()
        } else {
            console.log("Upload failed")
        }
        
        pfpSaveBtn.innerText = originalText
        pfpSaveBtn.disabled = false
    } catch (err) {
        console.error(err)
        pfpSaveBtn.innerText = "Upload"
        pfpSaveBtn.disabled = false
    }
})
async function loadMyAvatar() {
    if (!currentUser) return

    try {
        const res = await fetch(`/api/avatar/${currentUser}`)
        const data = await res.json()
        
        if (data.ok && data.avatar) {
            currentUserAvatar.src = data.avatar
        }
    } catch (err) {
        console.error("Avatar was not loaded: ", err)
    }
}
loadMyAvatar()